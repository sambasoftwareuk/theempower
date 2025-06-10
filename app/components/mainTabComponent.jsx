import React from 'react'
import { OutlinedButton } from '../_atoms/buttons'
import TabMenu from '../_molecules/tabMenu'
import { Header1 } from '../_atoms/Headers'

const MainTabComponent = ({tabs}) => {
  return (
    <div>
        <div className="my-4">
                <Header1>Boggarts lavender robes?</Header1>
                <p>
                  Hermione Granger Fantastic Beasts and Where to Find Them. Bee in your
                  bonnet Hand of Glory elder wand, spectacles House Cup Bertie Bott’s
                  Every Flavor Beans Impedimenta.
                </p>
              </div>
              <div className="my-4">
                <TabMenu tabs={tabs} />
              </div>
              <div className="my-4">
                <OutlinedButton label="Show All" />
              </div>
    </div>
  )
}

export default MainTabComponent