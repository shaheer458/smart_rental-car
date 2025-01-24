import React from 'react'
import PanelMenu from './PanelMenu'
import DetailsRental from './DetailsRental'
import TopCarRental from './TopCarRental'

function page() {
  return (
    <section className="lg:flex lg:justify-between">
        <PanelMenu/>

        <div className="lg:flex lg:justify-between p-6 lg:w-4/5">
          <DetailsRental/>
          <TopCarRental/>
        </div>
      </section>
  )
}

export default page
