import React, { useState } from 'react'

export default function Contact(listing) {
  const [landlord, setLandlord] = useState(false);
  const [message , setMessage] = useState(false);

  const onChange = (e) => {
    setMessage(e.target.value);
  }

 useEffect(() => {
  const fetchLandlord = async () => {
    try {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      setLandlord(data);
    } catch (error) {
      console.log(error)
    }
  }
  fetchLandlord();
 }, [listing.userRef]);
 

  return (
    <>
      {landlord && (
        <div className="">
          <p className="">Contact <span>{landlord.username}</span>for <span>{listing.name.toLowerCase()}</span> </p>
          <textarea name="message" id="message" onChange={onChange} value={message} placeholder='Enter your message Here' rows="2"></textarea>

        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase'>
         send Message
        </Link>

        </div>
      )}
    </>
  )
}

