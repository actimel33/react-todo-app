

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "../store/BoardStore";
import { memo } from "react";

const Header = () => {
  const { setSearchString } = useBoardStore();
  return (
    <header>
      <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
        <div
          className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-yellow-400  to-primary-300 rounded-md blur-3xl opacity-50 -z-50'
        />
        <div className='flex items-center space-x-5 flex-1 justify-center w-full '>
          {/* Search box */}
          <form
            action=''
            className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'
          >
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
            <input
              type='text'
              placeholder='search'
              className='flex-1 outline-none p-2'
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button hidden type='submit'>
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
