// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// // import { Swiper, SwiperSlide} from 'swiper/react';
// // import SwiperCore from 'swiper';
// // import { Navigation} from 'swiper/modules';
// // import 'swiper/css/bundle'; // Import Swiper styles
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { BiMap } from "react-icons/bi";

// export default function Listing() {
//   const params = useParams();
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           return;
//           setError(true);
//           setLoading(false);
//         }
//         setListing(data);
//         setLoading(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);

//   const Listing = ({ listing }) => {
//     useEffect(() => {
//       if (listing) {
//         console.log('Listing data:', listing);
//       }
//     }, [listing]);

//     if (!listing) {
//       // If listing is still loading, you might want to render a loading state or return null
//       return null;
//     }

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div>
//       {/* {listing && !loading && !error && (
//         <div className="">
//           <Slider>
//             {listing.imageUrls.map((url, index) => (
//               <div key={index} className="h-[550px] w-[200px]">
//                 <img
//                   src={url}
//                   alt={`Slide ${index}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )} */}

//       {listing && !loading && !error && (
//         <div className="">
//           {" "}
//           {/* Adjust the width of the carousel container */}
//           <Slider {...sliderSettings}>
//             {listing.imageUrls.map((url, index) => (
//               <div key={index} className="w-full">
//                 {" "}
//                 {/* Make each slide take the full width of the carousel */}
//                 <img
//                   src={url}
//                   alt={`Slide ${index}`}
//                   className=" w-full h-96 object-cover"
//                 />{" "}
//                 {/* Make each image take the full width of its container */}
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}
//      {/* <div className="">
//   {listing.name.map((names, index) => (
//     <div className="" key={index}>
//       <p className="">{names}</p>
//     </div>
//   ))}
// </div> */}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiMap } from "react-icons/bi";
import { FaBath, FaBed, FaCouch, FaParking } from "react-icons/fa";
import {  useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact , setContact] = useState(false);
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    if (listing) {
      console.log("Listing data:", listing);
    }
  }, [listing]);

  if (!listing) {
    return null;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="">
      {listing && !loading && !error && (
        <div className="">
          <Slider {...sliderSettings}>
            {listing.imageUrls.map((url, index) => (
              <div key={index} className="w-full">
                <img
                  src={url}
                  alt={`Slide ${index}`}
                  className="w-full h-96 object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* {listing.name.map((names, index) => (
          <div className="" key={index}>
            <p className="">{names}</p>
          </div>
        ))} */}
      <div className="flex pt-10 pl-10 flex-wrap">
        <p className="text-2xl font-semibold ">
          {listing.name} - ${" "}
          {listing.offer
            ? listing.discountPrice.toLocaleString("en-US")
            : listing.regularPrice.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>
      </div>
      <p className="flex ml-7 items-center p-3 text-xl font-medium">
        <BiMap className="w-5 text-green-900 bg-slate-50 " />
        {listing.address}
      </p>
      <div className="flex px-12 py-2 gap-4 ">
        <p className="bg-red-700 px-10 py-2 rounded-lg font-medium text-lg text-white hover:opacity-90">
          {listing.type === "rent" ? "For Rent" : "For sale"}
        </p>
        <p className="bg-green-700 px-16 py-2 rounded-lg font-medium text-lg text-white hover:opacity-90">
          ${+listing.regularPrice - +listing.discountPrice}
        </p>
      </div>
      <div className="flex  flex-wrap m-5">
        <span className="font-semibold text-sm text-black">Description:</span>
        <p className="text-slate-800">{listing.description}</p>
      </div>
      <div className="">
        <ul className="text-green-900 text-sm p-5 flex flex-wrap items-center">
          <li className="text-base flex flex-col items-center  gap-2 mr-3">
            {" "}
            <FaBed className="w-6" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}{" "}
          </li>
          <li className="text-base flex flex-col items-center  gap-2 mr-4">
            {" "}
            <FaBath className="w-8" />{" "}
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}{" "}
          </li>
          <li className="text-base flex flex-col items-center  gap-2 mr-4">
            {" "}
            <FaParking className="w-8" />{" "}
            {listing.parking ? "Parking" : " No parking"}
          </li>
          <li className="text-base flex flex-col items-center  gap-2 mr-4">
            {" "}
            <FaCouch className="w-8" />{" "}
            {listing.furnished ? "Furnished" : "Not Furnished"}{" "}
          </li>
        </ul>
        {currentUser &&
          listing.userRef !==
            currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className="bg-violet-900 px-5 py-2 text-white text-lg rounded-md uppercase hover:opacity-90 ml-8 ">
                Contact LandLord
              </button>
            )}
            {contact && <Contact listing={listing} />}
      </div>
    </div>
  );
};

export default Listing;
