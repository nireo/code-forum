import mongoose from "mongoose";

export const connectToDatabase = (uri: string) => {
    mongoose
        .connect(uri, { useNewUrlParser: true })
        .then(() => {
            console.log("Connected successfully to mongodb");
        })
        .catch(e => console.log(e));
};
