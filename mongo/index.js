const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect...', err))


const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    trim: true
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'A course should have at least one tag.'
    }
  },
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
    // name: 'Angular.js Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  })

  // Save course
  try {
    const result = await course.save()
    console.log(result)
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message)
    }
  }
}

createCourse();

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

// updateCourseAlternate('5bb0a413461b9f312034c201');


// Delete
async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  // const result = await Course.deleteMany({ _id: id });

  // Return the course that was deleted
  const course = await Course.findByIdAndRemove(id)
  console.log(course)

}

// removeCourse('5bb0a413461b9f312034c201')