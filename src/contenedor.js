import fs from 'fs';

class Contenedor {
  constructor(fileName) {
    this._filename = fileName;
    this.readFileOrCreateANewOne();
  }

  async readFileOrCreateANewOne() {
    try {
      await fs.promises.readFile(this._filename, "utf-8");
    } catch (error) {
      error.code === "ENOENT"
        ? this.createEmptyFile()
        : console.log(
            `Error Code: ${error.code} | There was an unexpected error when trying to read ${this._filename}`
          );
    }
  }

  async createEmptyFile() {
    fs.writeFile(this._filename, "[]", (error) => {
      error
        ? console.log(error)
        : console.log(`File ${this._filename} was not created because it didn't exist in the system`);
    });
  }

  async getById(id) {
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((producto) => producto.id === id);
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to get an element by its ID (${id})`
      );
    }
  }

  async deleteById(id) {
    try {
      id = Number(id)
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objIdRemove = parsedData.find(
        (producto) => producto.id === id
      )

      if (objIdRemove) {
        const index = parsedData.indexOf(objIdRemove);
        parsedData.splice(index, 1);
        await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to delete an element by its ID (${id})`
      );
    }
  }

  async updateById(id, newData){
    try {
      id = Number(id);
      const data = await this.getData();
      const objIdUpdate = parsedData.find(
      (producto) => producto.id === id
      )

      if (objIdUpdate) {
      const index = parsedData.indexOf(objIdUpdate);
      const {title, price, thumbnail} = newData;
      
      parsedData[index]['title'] = title
      parsedData[index]['price'] = price
      parsedData[index]['thumbnail'] = thumbnail
      await fs.promises.writeFile(this._filename, JSON.stringify(parsedData))
      return true
      }
    } catch (error){
      console.log(`Id ${id} does not exist in the file`)
      return null
    }
  }

  async save(object) {
    try {
      const allData = await this.getData();
      const parsedData = JSON.parse(allData);

      object.id = parsedData.length + 1;
      parsedData.push(object);

      await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
      return object.id;
    } catch (error) {
      console.log(
        `Error Code: ${error.code} | There was an error when trying to save an element`
      );
    }
  }

  async deleteAll() {
    try {
      await this.createEmptyFile();
    } catch (error) {
      console.log(
        `There was an error (${error.code}) when trying to delete all the objects`
      );
    }
  }

  async getData() {
    const data = await fs.promises.readFile(this._filename, "utf-8");
    return data;
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }
}

export default Contenedor;