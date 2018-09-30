const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect...', err))


const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: Boolean
});

// Create a Class by compiling the schema into a model
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  // Create an object based on that class
  const course = new Course({
    name: 'Angular.js Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  })

  // Save course
  const result = await course.save()
  console.log(result)
}

// createCourse();

// Query
async function getCourses() {
  const courses = await Course.find({ author: 'Mosh', isPublished: true })
  .limit(10)
  .sort({ name: 1 }) // Sort the course by name
  .select({ name: 1, tags: 1 })  // Select only fields you want to see
  console.log(courses)
}

// Advance Query
async function getCoursesAdvance() {
  // const courses = await Course.find({ price: { $gte: 10 , $lte: 20 } }) between 10 and 20
  // const courses = await Course.find({ price: { $in: [10, 15, 20] } }) Courses that are either 10 or 15 0r 20
  const courses = await Course.find({ author: /^Mosh/ }) // Regular expressions starts with Mosh
  const courses = await Course.find({ author: /Hamendani$/i }) // Regular expressions ends with Mosh
  const courses = await Course.find({ author: /.*Mosh.*/ }) // Regular expressions contains the word Mosh
  // .or([ { author: 'Mosh'}, { isPublished: true }]) // Get Courses authored by Mosh or Published
  .and([ ])
  .limit(10)
  .sort({ name: 1 })
  .select({ name: 1, tags: 1 })
  .count()
  console.log(courses)
}

// Pagination
async function getCoursesPaginate() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: 'Mosh', isPublished: true })
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize)
  .sort({ name: 1 }) // Sort the course by name
  .select({ name: 1, tags: 1 })  // Select only fields you want to see
  console.log(courses)
}

// getCourses()


// There are two ways to update a course; 1Query first and 2Update first

// Query first
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;

  // Approach 1
  course.isPublished = true;
  course.author = 'Another author';

  // Approach 2
  course.set({
    isPublished: true,
    author: 'Another Author'
  })

  const result = await course.save();
  console.log(result);
}


// Update first
async function updateCourseAlternate(id) {
  const result = await Course.findByIdAndUpdate({ _id: id}, {
    $set: {
      author: 'Mosh',
      isPublished: false
    }
  });

  if(!result) {
    console.log('Id does not exist')
  }
  
  console.log(result);
}

updateCourseAlternate('5bb0a413461b9f312034c201');