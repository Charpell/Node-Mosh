// Using References (Normalization)
// Advantage -> Consistency.  Disadvantage -> Query Performance
let author = {
  name: 'Mosh'
}

let course = {
  author: 'id'
}



// Using Embedded Documents (Denormalization)
// Advantage -> Query Performance. Disadvantage -> Consistency
let course = {
  author: {
    name: 'Mosh'
  }
}


// Hybrid 
let author = {
  name: 'Mosh',
  // 50 other properties
}

let course = {
  author: {
    id: 'ref',
    name: 'Mosh'
  }
}