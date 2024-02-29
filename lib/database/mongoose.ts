import mongoose, { Mongoose } from "mongoose";

// Deklarasi konstanta MONGODB_URL dengan mengambil nilai dari environment variable MONGODB_URL
const MONGODB_URL = process.env.MONGODB_URL;

// Interface MongooseConnection dengan dua properti: conn dan promise
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Variabel cached bertipe MongooseConnection, digunakan untuk menyimpan koneksi ke database yang sudah ada
// Variabel ini akan di-cache untuk penggunaan berikutnya
let cached: MongooseConnection = (global as any).mongoose;

// Jika variabel cached belum ada, maka inisialisasi variabel cached dengan nilai null
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Fungsi connectToDatabase yang akan digunakan untuk membuat atau mengambil koneksi ke database
export const connectToDatabase = async () => {
  // Jika variabel cached.conn sudah ada, maka kembalikan koneksi tersebut
  if (cached.conn) return cached.conn;

  // Jika MONGODB_URL belum terdefinisi, maka lemparkan error
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // Jika variabel cached.promise belum terdefinisi, maka buat koneksi baru ke database
  cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "imaginify",
      bufferCommands: false,
    });

  // Tunggu hingga koneksi selesai, dan simpan hasilnya ke dalam variabel cached.conn
  cached.conn = await cached.promise;

  // Kembalikan koneksi yang sudah dibuat
  return cached.conn;
};
