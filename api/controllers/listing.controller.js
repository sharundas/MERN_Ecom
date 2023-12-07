import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';


export const createListing = async (req,res,next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

 export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing) {
    return next(errorHandler(404, 'Listing is not found'));
  }
  if(req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'you can only delete your own listing'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('listing Got deleted');
  } catch (error) {
    next(error);
  }
}

export const updateListing = async (req,res,next) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing Not found'));
  }
  if (req.user.id !== listing.userRef){
    return next(errorHandler(401 , 'you can only update your own listing'));
  }
   try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    )
    res.status(200).json(updatedListing);
   } catch (error) {
    next(error);
   }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Send the listing as a response
    res.status(200).json(listing);
  } catch (error) {
    // Handle other errors
    next(error);
  }
}


// export const getListings = async (req,res, next) => {
//    try {
    
//    const limit = parseInt(req.query.limit) || 9;
//    const startIndex = parseInt(req.query.startIndex) || 0;

//    let offer = req.query.offer;

//    if (offer === undefined || offer === 'false') {
//     offer = { $in: [false, undefined]};
//    }
   
//    let furnished = req.query.furnished;

//    if(furnished === undefined || furnished === 'false') {
//     furnished = { $in: [false, undefined]}
//    }

//    let parking = req.query.parking;

//    if (parking === undefined || parking === 'false') {
//     parking = { $in: [false, undefined]}
//    }

//    let type = req.query.type;

//    if (type === undefined || type === 'false') {
//     type = { $in: ['sale', 'rent']};
//    }

//    const searchTerm = req.query.searchTerm || '';

//    const sort = req.query.sort || 'createdAt';

//    const order = req.query.order || 'desc';

//    const listing = await Listing.find({
//     name: {$regex: searchTerm, $options: 'i'},
//     offer,
//     furnished,
//     parking,
//     type,
//    }).sort(
//     {[sort]: order}
//    ).limit(limit).skip(startIndex);

//    return response.status(200).json(listing);

//   // regex is a build in functoin og mongodb that help to find the word in the paragraph , it find the searched thing from the words
//   // option = i , is saying thag dont care about the upperand lowercase


//    } catch (error) {
//     next(error);
//    }
// }


// const getListings = async (req, res, next) => {
//   try {
//     const limit = parseInt(req.query.limit) || 9;
//     const startIndex = parseInt(req.query.startIndex) || 0;

//     let offer = req.query.offer;

//     if (offer === undefined || offer === 'false') {
//       offer = { $in: [false, undefined] };
//     }

//     let furnished = req.query.furnished;

//     if (furnished === undefined || furnished === 'false') {
//       furnished = { $in: [false, undefined] };
//     }

//     let parking = req.query.parking;

//     if (parking === undefined || parking === 'false') {
//       parking = { $in: [false, undefined] };
//     }

//     let type = req.query.type;

//     if (type === undefined || type === 'false') {
//       type = { $in: ['sale', 'rent'] };
//     }

//     const searchTerm = req.query.searchTerm || '';
//     const sort = req.query.sort || 'createdAt';
//     const order = req.query.order || 'desc';

//     const listings = await Listing.find({
//       name: { $regex: searchTerm, $options: 'i' },
//       offer,
//       furnished,
//       parking,
//       type,
//     })
//       .sort({ [sort]: order })
//       .limit(limit)
//       .skip(startIndex);

//     return res.status(200).json(listings);
//   } catch (error) {
//     console.error('Error fetching listings:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// export { getListings };


export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};








