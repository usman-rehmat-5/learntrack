const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const UserProgress = require('../models/UserProgress');
const Rating = require('../models/Rating');
const LectureNote = require('../models/LectureNote');
const User = require('../models/User');

async function deleteAllCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courseCount = await Course.countDocuments();
    console.log(`Found ${courseCount} courses to delete`);

    const lectureCount = await Lecture.countDocuments();
    console.log(`Found ${lectureCount} lectures to delete`);

    await Lecture.deleteMany({});
    console.log('Deleted all lectures');

    await UserProgress.deleteMany({});
    console.log('Deleted all user progress records');

    await Rating.deleteMany({});
    console.log('Deleted all ratings');

    await LectureNote.deleteMany({});
    console.log('Deleted all lecture notes');

    await Course.deleteMany({});
    console.log('Deleted all courses');

    await User.updateMany({}, { $set: { activeCourse: null, courseCompleted: false } });
    console.log('Reset all user enrollments');

    console.log('All course-related data deleted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllCourses();
