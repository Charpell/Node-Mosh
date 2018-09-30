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

createCourse();