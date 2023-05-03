import Koa from "koa";
import koaStatic from "koa-static";
import bodyParser from "koa-bodyparser";
import router from "./routes/router.js";
import { MensajesDao } from "./dao/MensajesDao.js";
import { ProductoDao } from "./dao/ProductoDao.js";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import handlebars from "handlebars";
import Handlebars from "koa-handlebars";
import { Server } from "socket.io";
import session from "koa-generic-session";
import path from "path";
import mongoStore from "connect-mongo";
import cluster from "cluster";
import os from "os";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./modules/user.modules.js";
import passport from "passport";
import parseArgs from "minimist";
import dotenv from "dotenv";
import compression from "compression";
import logger from "./loggers/Log4jsLogger.js";
import loggerMiddleware from "./middlewares/routesLogger.middleware.js";

dotenv.config();

const app = new Koa();

const server = http.createServer(app.callback());

const productosDao = new ProductoDao();
const chat = new MensajesDao();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(koaStatic(path.join(__dirname, "/src/public")));

app.use(bodyParser());

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, //10 min.
  })
);

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
//
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((data) => {
      done(null, data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(loggerMiddleware);

const configHandlebars = {
  viewEngine: new Handlebars({
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    allowProtoMethodsByDefault: true,
  }),
  viewPath: __dirname + "/views",
};

app.use(Handlebars(configHandlebars));

app.use(router.routes());

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
  const expressServer = server.listen(PORT, () =>
    logger.info(` >>>>> 🚀 Server started at http://localhost:${PORT}`)
  );

  const io = new Server(expressServer);

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

  server.on("error", (err) => logger.log(err));
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

/* const mongoStore = koaMongoStore.create({
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
); */
