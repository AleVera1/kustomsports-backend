### Proyecto para coderhouse

import multer from "multer";

const storage = multer.diskStorage({
destination: (req, file, cb) => {
const destination = "acá iría el destino donde se guarda la imagen";
cb(null, destination);
},
filename: (req, file, cb) => {
cb(null, file.originalname);
},
});

const upload = multer({ storage });

export default upload;

después donde lo importamos iría por ejemplo en el router:

.post(
upload.single("photo"), luego sigue passport.auth, etc etc

---

o podés armar más completa la configuración, y en el router solo lo llamás luego de importarlo

import multer from "multer";

let storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "src/public/uploads");
},
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname);
},
});

export let uploader = multer({ storage }).single("file"); entonces al exportarlo más completo, luego en el router lo importamos y lo llamamos así directamente:

.post(
"/register",
uploader,también luego iría el passport.auth
