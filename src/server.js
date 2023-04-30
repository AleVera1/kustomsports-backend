import Koa from "koa";
import handlebars from "koa-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import { MensajesDao } from "./dao/MensajesDao.js";
import { ProductoDao } from "./dao/ProductoDao.js";
import { User } from "./modules/user.modules.js";
import passport from "koa-passport";
import { passportStrategies } from "./lib/passport.lib.js";
import parseArgs from "minimist";
import dotenv from "dotenv";
import os from "os";
import compress from "koa-compress";
import logger from "./loggers/Log4jsLogger.js";
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";
import router from "./routes/router.js";
import koaMongoStore from "koa-session-mongoose";
import session from "koa-session";
import serve from "koa-static";

dotenv.config();

const app = new Koa();

const productosDao = new ProductoDao();
const chat = new MensajesDao();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mongoStore = koaMongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

app.keys = [process.env.SECRET];

app.use(
  session(
    {
      store: mongoStore,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 600000, //10 min.
      },
    },
    app
  )
);

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const data = await User.findById(id);
    done(null, data);
  } catch (err) {
    console.error(err);
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(loggerMiddleware);
app.use(compress());
app.use(serve("public"));

/* app.use('/productos', productRouter);
app.use('/cart', cartRouter);
app.use('/test', otherRouter); */
app.use(router.routes()).use(router.allowedMethods());

/* app.use(async (ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { error: "ruta no existente" };
}); */

app.use(
  handlebars({
    extension: ".hbs",
    defaultLayout: "index.hbs",
    viewsDir: __dirname + "/views",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    allowProtoMethodsByDefault: true,
  })
);

const args = process.argv.slice(2);
const options = {
  alias: {
    p: "port",
    m: "mode",
  },
  default: {
    port: 8080,
    mode: "fork",
  },
};

const minimistArgs = parseArgs(args, options);

const cpus = os.cpus();
const PORT = process.env.PORT;

const startServer = () => {
  const koaServer = app.listen(PORT, () =>
    logger.info(` >>>>> 🚀 Server started at http://localhost:${PORT}`)
  );

  const io = new Server(koaServer);

  io.on("connection", async (socket) => {
    console.log("🟢 Usuario conectado");

    const productos = await productosDao.getAll();

    socket.emit("bienvenidoLista", productos);

    const mensajes = await chat.getAll();
    socket.emit("listaMensajesBienvenida", mensajes);

    socket.on("nuevoMensaje", async (data) => {
      await chat.createMessage(data);

      const mensajes = await chat.getAll();
      io.sockets.emit("listaMensajesActualizada", mensajes);
    });

    socket.on("productoAgregado", async (data) => {
      console.log("Alguien presionó el click");
      await productosDao.createProduct(data);

      const productos = await productosDao.getAll();
      io.sockets.emit("listaActualizada", productos);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado");
    });
  });

  app.on("error", (err) => logger.log(err));
};

if (minimistArgs.mode === "cluster") {
  if (cluster.isPrimary) {
    cpus.map(() => cluster.fork());

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    startServer();
  }
} else if (minimistArgs.mode === "fork") {
  startServer();
} else {
  console.log(
    `${minimistArgs.mode} is not a valid mode. Please choose fork or cluster`
  );
  process.exit(1);
}
