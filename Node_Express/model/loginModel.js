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
        console.log('App will continue without database connection');
        // Don't throw error - let app run without database
    }
};

// Call connectDB when module loads (non-blocking)
connectDB().catch(err => console.log('Database connection failed, continuing without database'));

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
    console.log(`Selection ${selection}`);
    if(!selection) { return false; }
    
    const hashedPassword = hashPassword(user_password);
    
    const isValid = (selection.password === hashedPassword);
    return ({
      success: isValid,
      id: selection._id.toString(),
      username: selection.username,
      agency_name: selection.agency_name,
      isAdmin: selection.isAdmin || false
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
        isAdmin: false,
        created_at: new Date()
    };
    
    const insertResult = await usersCollection.insertOne(newUser);
    return insertResult;
}

// Create Booking
export async function createBooking(userId, venue, artistName, concertTitle, date, timeSlot, amountExpected, receiptId)
{

    receiptId = `A${Math.random()}`;
    console.log(`Here is the venue boh ${venue}`);
    
    const venueData = await getVenuesByName(venue);
    
    if (timeSlot === 'Morning') {
        amountExpected = venueData.morning_price;
    } else if (timeSlot === 'Afternoon') {
        amountExpected = venueData.afternoon_price;
    } else if (timeSlot === 'Evening') {
        amountExpected = venueData.evening_price;
    }
    
    console.log(`Amount Expected: ${amountExpected}`);
    const newBooking = {
        user_id: new mongodb.ObjectId(userId),
        // venue_id: new mongodb.ObjectId(venueId),
        venue_name: venue,
        artist_name: artistName,
        concert_title: concertTitle,
        date: new Date(date),
        time_slot: timeSlot,
        amount_expected: amountExpected,
        status: 'Paid',
        receipt_id: receiptId
    };

    console.log(newBooking);
    
    const result = await bookingsCollection.insertOne(newBooking);
    return result;
}

export async function getUserIdByUsername(username) {
    return await usersCollection.findOne({ username: username });
}

// Get Bookings by User ID
export async function getBookingsByUserId(userId) {
    // console.log(`Code is running...`)
    // console.log(`userId: ${userId}`)

    const bookings = await bookingsCollection.find({ user_id: new mongodb.ObjectId(userId) }).toArray();

    console.log(`ObjectID: ${mongodb.ObjectId(userId)}`);
    return bookings;
}

export async function getBookingsByObjectId(userId) {
    return await bookingsCollection.find({ user_id: new mongodb.ObjectId(userId) }).toArray();
}

export async function getVenuesByName(venueName) {
    return await venuesCollection.findOne({ name: venueName });
}

export async function getUserCount()
{
    const userCount = await usersCollection.countDocuments({});
    return userCount;
}

export async function getBookingsCount()
{
    return await db.collection('bookings').countDocuments({});
}

export async function getVenueCount()
{
    return await db.collection('venues').countDocuments({});
}
// Delete booking by Object Id

export async function updateUsernameByUserId(userId, newUsername) {
    const result = await usersCollection.updateOne(
        { _id: new mongodb.ObjectId(userId) },
        { $set: { username: newUsername } }
    );
    return result;
}

export async function updatePasswordByUserId(userId, newPassword) {
    const result = await usersCollection.updateOne(
        { _id: new mongodb.ObjectId(userId) },
        { $set: { password: hashPassword(newPassword) } }
    );
    return result;
}

export async function removeBookingByObjectId(bookingId) {
    const result = await bookingsCollection.deleteOne(
        { _id: new mongodb.ObjectId(bookingId) }
    );
    return result;
}

// Admin functions
export async function getAllUsers() {
    return await usersCollection.find({}).toArray();
}

export async function getAllBookings() {
    return await bookingsCollection.find({}).toArray();
}

export async function getAllVenues() {
    return await venuesCollection.find({}).toArray();
}

export async function deleteUserById(userId) {
    const result = await usersCollection.deleteOne(
        { _id: new mongodb.ObjectId(userId) }
    );
    return result;
}

export async function updateVenueField(venueId, fieldName, fieldValue) {
    const updateData = {};
    updateData[fieldName] = parseInt(fieldValue);
    
    const result = await venuesCollection.updateOne(
        { _id: new mongodb.ObjectId(venueId) },
        { $set: updateData }
    );
    return result;
}


export {connectDB};