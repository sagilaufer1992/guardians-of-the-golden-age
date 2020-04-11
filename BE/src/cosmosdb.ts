import * as mongoose from 'mongoose';

const connectDB = async () => {
    const conn = await mongoose.connect(`${process.env.DB_CONN_STRING}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;