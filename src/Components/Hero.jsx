import React from 'react'
import Calendar from './Calender'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <section className="w-full h-screen  px-4 py-24 mx-auto max-w-7xl">
            <div className="mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
                <h1 className="mb-6 text-4xl font-extrabold leading-none font-[ZCOOL] text-white md:text-6xl md:tracking-tight uppercase tracking-tighter ">
                Your productivity, your way! <span className=" text-[#0AACBE] lg:inline">Organize </span>, <span className=" text-[#0AACBE] lg:inline">plan</span>, and <span className=" text-[#0AACBE] lg:inline">execute</span> with ease. 
                </h1>
                <div className="grid grid-cols-5 grid-rows-5 gap-2">
                    <div className="col-span-2 row-span-2 rounded min-h-60  flex items-center justify-center">
                        <Calendar/>
                    </div>
                    <div className="col-span-2 bg-[url(/addBLogImg.jpg)] bg-center bg-cover row-span-2 rounded min-h-60 col-start-4  border flex items-center justify-center">
                        <Link className='p-3 border rounded bg-white text-black font-bold' to={"/addtask"}>Add Task</Link>
                    </div>
                </div>
            </div>
            {/* <div className="w-full mx-auto mt-20 text-center md:w-10/12">
                <img src="https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80" alt="Hellonext feedback boards software screenshot" className="w-full rounded-lg shadow-2xl" />
            </div> */}
        </section>
    )
}

export default Hero
