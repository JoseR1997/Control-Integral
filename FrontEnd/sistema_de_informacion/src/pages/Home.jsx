import React from 'react';
import banner from '../assets/images/banner3.png';
import CasosRecientes from '../components/common/CasosRecientes';
import NuevosClientes from '../components/common/NuevosClientes';

const Home = () => {
  return (
    <>
      <div className='w-full h-auto flex justify-center mt-[40px]'>
        <img src={banner} alt="Banner" width={700} />
      </div>
      <div className="grid md:grid-cols-2 gap-8 mx-10 mt-10">
          <section className="bg-white rounded-lg shadow-lg p-6">
            <CasosRecientes />
          </section>
          
          <section className="bg-white rounded-lg shadow-lg p-6">
            <NuevosClientes />
          </section>
        </div>
    </>
  );
};

export default Home;
