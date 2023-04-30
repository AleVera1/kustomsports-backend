export default function auth(ctx, next) {
  if (ctx.session.login) {
    next();
  } else {
    return ctx.status(401).send("No autorizado");
  }
}
