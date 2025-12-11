import express from 'express';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import crypto from 'crypto';

const model = express.Router(); // An express router
dotenv.config();

// MongoDB connection
let db;
let usersCollection;
let venuesCollection;
let bookingsCollection;
let transactionsCollection;

// Connect to MongoDB
const connectDB = async () => {
    try {
        const client = new mongodb.MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db('concert_booking_db');
        
        // Initialize collections
        usersCollection = db.collection('users');
        venuesCollection = db.collection('venues');
        bookingsCollection = db.collection('bookings');
        transactionsCollection = db.collection('transactions');
        
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Call connectDB when module loads
connectDB();

// Export db for use in other modules
export { db, usersCollection, venuesCollection, bookingsCollection, transactionsCollection };

// For hashing passwords
export function hashPassword(user_password)
{
    return crypto.createHash('sha256').update(user_password).digest('hex');
}


// ======= Get Data =======


// Gets info about a row based on User ID
export async function getRow(id)
{
    const result = await usersCollection.findOne({ _id: new mongodb.ObjectId(id) });
    return result;
}

// Verify Account Credentials
export async function verifyLogin(user_username, user_password)
{
    const selection = await usersCollection.findOne({ username: user_username });
    
    if(!selection) { return false; }
    
    const hashedPassword = hashPassword(user_password);
    
    const isValid = (selection.password === hashedPassword);
    return ({
      success: isValid,
      id: selection._id.toString(),
      username: selection.username,
      agency_name: selection.agency_name
    });
}

// Reset User Password
export async function resetPassword(user_username){
    
}


export async function getUserData(username, password) {
  // Fetch user record
  const user = await usersCollection.findOne({ username: username });

  if (!user) return false; // user not found

  const hashed = hashPassword(password);

  if (user.password !== hashed) return false; // wrong password

  // Return user object without password
  return {
    id: user._id.toString(),
    username: user.username,
    agency_name: user.agency_name,
    created_at: user.created_at
  };
}

// ======= Create Data =======



// Create Account
export async function createUser(agency_name, user_username, user_password)
{
    const hashedPassword = hashPassword(user_password);
    
    const newUser = {
        agency_name: agency_name,
        username: user_username,
        password: hashedPassword,
        created_at: new Date()
    };
    
    const insertResult = await usersCollection.insertOne(newUser);
    return insertResult;
}

// Create Booking
export async function createBooking(userId, venueId, artistName, concertTitle, date, timeSlot, amountExpected, receiptId)
{
    const newBooking = {
        user_id: new mongodb.ObjectId(userId),
        venue_id: new mongodb.ObjectId(venueId),
        artist_name: artistName,
        concert_title: concertTitle,
        date: new Date(date),
        time_slot: timeSlot,
        amount_expected: amountExpected,
        status: 'pending',
        receipt_id: receiptId
    };
    
    const result = await bookingsCollection.insertOne(newBooking);
    return result;
}

// Get Bookings by User ID
export async function getBookingsByUserId(userId) {
    const bookings = await bookingsCollection.find({ user_id: new mongodb.ObjectId(userId) }).toArray();
    return bookings;
}

export {connectDB};