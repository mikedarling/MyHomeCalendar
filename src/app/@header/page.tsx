'use client';

const HomeHeader = () => {
  const title = process.env.NEXT_PUBLIC_APPLICATION_TITLE;
  
  return (
    <>
      {title}
    </>
  )
}

export default HomeHeader;