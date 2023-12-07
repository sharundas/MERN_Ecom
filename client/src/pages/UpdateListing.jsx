import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";


export default function UpdateListing() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
   const fetchListing = async () => {
    const listingId = params.listingId;
    const res = await fetch(`/api/listing/get/${listingId}`);
    const data = await res.json();
    if (data.success === false){
      console.log(data.message);
      return;
    }
    setFormData(data);
   }
   fetchListing();
  },[]);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only Upload 6 image per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("you must upload atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto text-center max-w-4xl">
      <p className="text-3xl font-semibold text-center mt-8 my-4">
        Update Listing
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <div className="flex flex-col flex-1 gap-5 p-5">
          <input
            type="text"
            placeholder="Name"
            className="p-3 "
            id="name"
            required
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            id="description"
            placeholder="Description"
            required
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="p-3"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className="flex gap-10 flex-wrap mx-4">
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="w-8 h-8"
              id="sale"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <span className=" flex ">sell</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="w-8 h-8"
              id="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <span className=" flex ">Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="w-8 h-8"
              id="parking"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span className=" flex ">Parking spot</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="w-8 h-8"
              id="furnished"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span className=" flex ">Furnished</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="w-8 h-8"
              id="offer"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span className=" flex ">Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 my-5 mx-3">
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="1"
              max="10"
              required
              className="p-2"
              id="bedrooms"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <span className="">Beds</span>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="1"
              max="10"
              required
              className="p-2"
              id="bathrooms"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <span className="">Bath Room</span>
          </div>
        </div>

        <div className="flex gap-3 m-5">
          <input
            type="number"
            placeholder="$"
            className="w-20 items-center p-2 "
            min="50"
            max="1000000"
            id="regularPrice"
            onChange={handleChange}
            value={formData.regularPrice}
          />
          <div className="flex flex-col">
            <p className="">Regular Price</p>
            <span className="text-xs text-gray-600">($ / Month)</span>
          </div>

          {formData.offer && (
            <div className="">
              <input
                type="number"
                placeholder="$"
                className="w-20 items-center p-2 "
                min={50}
                max={100000}
                id="discountPrice"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col">
                <p className="">Discounted price</p>
                <span className="text-xs text-gray-600">($ / Month)</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-start m-5">
          <p className="font-bold">Image:</p>
          <span>
            {" "}
            The First Image will be the cover (max 6) and below (2MB){" "}
          </span>
        </div>
        <div className="flex justify-center gap-6 mb-9 ">
          <input
            type="file"
            className="border-solid border-2 border-gray-200 p-2 "
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button
            disabled={uploading}
            onClick={handleImageSubmit}
            className=" text-green-500 px-6 py-2 rounded-lg border-2 border-green-400  hover:shadow-lg uppercase  "
            type="button"
          >
            {uploading ? "uploading..." : "Upload"}
          </button>
        </div>
        <p className="text-red-700 mb-5 text-sm">
          {imageUploadError && imageUploadError}
        </p>

        {/* // image upload image  function */}
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between p-3 border items-center"
            >
              <img
                src={url}
                alt="listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
        <div className="mb-20">
          <button
            disabled={loading || uploading}
            className="bg-gray-700 px-20 py-3 max-w-2xl m-auto rounded-lg hover:opacity-95 text-white uppercase"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
        {/* {
          formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
            <div key={url} className="">
              <img src={url} alt="Listing Image" className="w-20 h-20 object-contain rounded-lg" />
              <button className="">Delete</button>
            </div>
          })
        } */}
      </form>
    </main>
  );
}
