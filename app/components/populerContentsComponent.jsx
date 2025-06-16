import React from 'react'
import CourseCard from '../_molecules/courseCard'
import { Header2 } from '../_atoms/Headers'

const PopularContentsComponent = () => {
  return (
    <div className="flex flex-col w-full my-4">
        <Header2>Popular Courses</Header2>
        <div className='flex flex-wrap gap-2 justify-center mt-5 w-full'>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
        </div>
    </div>
  )
}

export default PopularContentsComponent