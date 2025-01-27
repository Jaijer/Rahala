import React, { useState, useEffect } from "react";
import {
Modal,
ModalContent,
ModalHeader,
ModalBody,
ModalFooter,
Button,
Input,
Textarea
} from "@nextui-org/react";
import axios from 'axios';
import useUserStore from "../../../stores/userDataStore";
import api from "../../../api/axios";
import { getAuth } from 'firebase/auth';

const AddTravelModal = ({ isOpen, onClose, travel }) => {
    const {userData} = useUserStore();
    const [travelName, setTravelName] = useState("");
    const [from, setFrom] = useState("");
    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [dates, setDates] = useState([{ departure: "", arrival: "", capacity: "" }]);
    const [packages, setPackages] = useState([{ title: "", price: "" }]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const isEdit = travel?._id; // if we have a travel, then this is an edit modal

    // Validation states (same as previous code)
    const [validations, setValidations] = useState({
        travelName: { isValid: true, message: "" },
        from: { isValid: true, message: "" },
        destination: { isValid: true, message: "" },
        description: { isValid: true, message: "" },
        dates: { isValid: true, message: "" },
        packages: { isValid: true, message: "" },
        image: { isValid: true, message: "" }
    });

    // Validation functions
    const validateTravelName = (value) => {
      const isValid = value.trim().length > 0;
      return {
          isValid,
          message: isValid ? "" : "يرجى إدخال اسم الرحلة"
      };
    };

    const validateFrom = (value) => {
      const isValid = value.trim().length > 0;
      return {
          isValid,
          message: isValid ? "" : "يرجى إدخال مدينة المغادرة"
      };
    };

    const validateDestination = (value) => {
      const isValid = value.trim().length > 0;
      return {
          isValid,
          message: isValid ? "" : "يرجى إدخال مدينة الوصول"
      };
    };

    const validateDescription = (value) => {
      const isValid = value.trim().length >= 10;
      return {
          isValid,
          message: isValid ? "" : "يرجى إدخال وصف تفصيلي (10 أحرف على الأقل)"
      };
    };

    const validateDates = (currentDates) => {
      const isValid = currentDates.every(date => 
          date.departure && date.arrival && 
          new Date(date.departure) <= new Date(date.arrival) &&
          parseInt(date.capacity) > 0
      );
      return {
          isValid,
          message: isValid ? "" : "يرجى التأكد من صحة التواريخ والسعة"
      };
    };

    const validatePackages = (currentPackages) => {
      const isValid = currentPackages.every(pkg => 
          pkg.title.trim().length > 0 && 
          parseFloat(pkg.price) > 0
      );
      return {
          isValid,
          message: isValid ? "" : "يرجى التأكد من صحة الباقات"
      };
    };

    // Handlers with real-time validation
    const handleTravelNameChange = (e) => {
      const value = e.target.value;
      setTravelName(value);
      setValidations(prev => ({
          ...prev,
          travelName: validateTravelName(value)
      }));
    };

    const handleFromChange = (e) => {
      const value = e.target.value;
      setFrom(value);
      setValidations(prev => ({
          ...prev,
          from: validateFrom(value)
      }));
    };

    const handleDestinationChange = (e) => {
      const value = e.target.value;
      setDestination(value);
      setValidations(prev => ({
          ...prev,
          destination: validateDestination(value)
      }));
    };

    const handleDescriptionChange = (e) => {
      const value = e.target.value;
      setDescription(value);
      setValidations(prev => ({
          ...prev,
          description: validateDescription(value)
      }));
    };

    const handleAddDate = () => {
      const newDates = [...dates, { departure: "", arrival: "", capacity: "" }];
      setDates(newDates);
      setValidations(prev => ({
          ...prev,
          dates: validateDates(newDates)
      }));
    };

    const handleRemoveDate = (index) => {
      const newDates = dates.filter((_, i) => i !== index);
      setDates(newDates);
      setValidations(prev => ({
          ...prev,
          dates: validateDates(newDates)
      }));
    };

    const isoToDateFormat = (isoDate) => {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
      const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
      return `${year}-${month}-${day}`;
    };

    const handleDateChange = (index, field, value) => {
      const updatedDates = dates.map((date, i) => 
          i === index ? { ...date, [field]: value } : date
      );
      setDates(updatedDates);
      setValidations(prev => ({
          ...prev,
          dates: validateDates(updatedDates)
      }));
    };

    const handleAddPackage = () => {
      const newPackages = [...packages, { title: "", price: "" }];
      setPackages(newPackages);
      setValidations(prev => ({
          ...prev,
          packages: validatePackages(newPackages)
      }));
    };

    const handleRemovePackage = (index) => {
      const newPackages = packages.filter((_, i) => i !== index);
      setPackages(newPackages);
      setValidations(prev => ({
          ...prev,
          packages: validatePackages(newPackages)
      }));
    };

    const handlePackageChange = (index, field, value) => {
      const updatedPackages = packages.map((pkg, i) => 
          i === index ? { ...pkg, [field]: value } : pkg
      );
      setPackages(updatedPackages);
      setValidations(prev => ({
          ...prev,
          packages: validatePackages(updatedPackages)
      }));
    };    
    // New function to handle image upload to Cloudinary
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setValidations(prev => ({
                    ...prev,
                    image: { 
                        isValid: false, 
                        message: "يرجى رفع صورة بصيغة jpeg أو png أو gif" 
                    }
                }));
                return;
            }

            if (file.size > maxSize) {
                setValidations(prev => ({
                    ...prev,
                    image: { 
                        isValid: false, 
                        message: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت" 
                    }
                }));
                return;
            }

            // Set preview
            setImagePreview(URL.createObjectURL(file));
            setImage(file);
            setValidations(prev => ({
                ...prev,
                image: { isValid: true, message: "" }
            }));
        }
    };

    // Remove image function
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

        try {
            setIsUploading(true);
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, 
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
      if (isEdit && travel) {
          setTravelName(travel.travelName || "");
          setFrom(travel.from || "");
          setDestination(travel.destination || "");
          setDescription(travel.description || "");
          setDates(
            travel.dates
              ? travel.dates.map(date => ({
                  departure: isoToDateFormat(date.departure),
                  arrival: isoToDateFormat(date.arrival),
                  capacity: date.capacity.toString()
                }))
              : [{ departure: "", arrival: "", capacity: "" }]
          );
          setPackages(travel.packages || [{ title: "", price: "" }]);
          setImage(travel.image || null);
          setImagePreview(travel.image || null);
      } else {
          // Reset fields when modal closes or for a new travel
          setTravelName("");
          setFrom("");
          setDestination("");
          setDescription("");
          setDates([{ departure: "", arrival: "", capacity: "" }]);
          setPackages([{ title: "", price: "" }]);
          setImage(null);
          setImagePreview(null);
      }
  }, [isEdit, travel, isOpen]);
  

    const handleSubmit = async () => {
        // Validate all fields including image
        const newValidations = {
            travelName: validateTravelName(travelName),
            from: validateFrom(from),
            destination: validateDestination(destination),
            description: validateDescription(description),
            dates: validateDates(dates),
            packages: validatePackages(packages),
            image: image ? 
            { isValid: true, message: "" } : 
            { isValid: false, message: "يرجى رفع صورة للرحلة" }
        };
    
        setValidations(prev => ({
            ...prev,
            ...newValidations
        }));
    
        // Check if all validations pass
        const isFormValid = Object.values({...validations, ...newValidations}).every((validation) => validation.isValid);
    
        if (isFormValid) {
            try {
                // Upload image to Cloudinary
                let imageUrl = null;
                if (image) {
                    imageUrl = await uploadToCloudinary(image);
                }

                const travelData = {
                    travelName,
                    from,
                    destination,
                    description,
                    dates: dates.map(date => ({
                        departure: date.departure,
                        arrival: date.arrival,
                        capacity: parseInt(date.capacity),
                        bookedCount: 0
                    })),
                    packages,
                    agency: userData._id,
                    image: imageUrl // Add image URL to travel data
                };

                const auth = getAuth();
                const user = auth.currentUser;
              
                if (!user) {
                  console.error('User not authenticated');
                  return;
                }
              
                const token = await user.getIdToken();
        
    
                if (isEdit) {
                  // Update travel
                    const response = await api.put(
                    `/api/travels/${travel._id}`,
                    travelData, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                console.log("Travel updated successfully:", response.data);
                } else {
                    // Create new travel
                    const response = await api.post(
                        `/api/travels`,
                        travelData, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, 
                            },
                        }    
                    );
                    console.log("Travel added successfully:", response.data);
                }
                window.location.reload();
                onClose();
            } catch (error) {
                console.error("Error adding the travel: ", error);
                // Optionally, show an error message to the user
            }
        }
    };    

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} className="p-3" scrollBehavior="outside">
        <ModalContent>
            <>
            <ModalHeader className="flex flex-col gap-1">إضافة رحلة جديدة</ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-6">
                  {/* Travel Name (Row 1) */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="اسم الرحلة"
                    placeholder="اسم الرحلة"
                    value={travelName}
                    isInvalid={!validations.travelName.isValid}
                    errorMessage={validations.travelName.message}
                    onChange={handleTravelNameChange}
                    />
                </div>

                {/* From and Destination (Row 2) */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="مدينة المغادرة"
                    placeholder="مدينة المغادرة"
                    value={from}
                    isInvalid={!validations.from.isValid}
                    errorMessage={validations.from.message}
                    onChange={handleFromChange}
                    />
                    <Input
                    label="مدينة الوصول"
                    placeholder="مدينة الوصول"
                    value={destination}
                    isInvalid={!validations.destination.isValid}
                    errorMessage={validations.destination.message}
                    onChange={handleDestinationChange}
                    />
                </div>

                {/* Description (Own Row) */}
                <Textarea
                    label="الوصف"
                    placeholder="الوصف"
                    value={description}
                    isInvalid={!validations.description.isValid}
                    errorMessage={validations.description.message}
                    onChange={handleDescriptionChange}
                />

                {/* Dates Section */}
                <div className="flex flex-col gap-4">
                    <div className="text-lg font-bold">التواريخ</div>
                    {dates.map((date, index) => (
                    <div key={index} className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[140px]">
                                <Input
                                label="تاريخ المغادرة"
                                type="date"
                                isInvalid={!validations.dates.isValid}
                                value={date.departure}
                                onChange={(e) => {
                                    handleDateChange(index, "departure", e.target.value);
                                }}
                                />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <Input
                                label="تاريخ الوصول"
                                type="date"
                                isInvalid={!validations.dates.isValid}
                                value={date.arrival}
                                onChange={(e) => {
                                    handleDateChange(index, "arrival", e.target.value);
                                }}
                                />
                            </div>
                            <div className="flex items-start pt-1">
                                <Button
                                    color="danger"
                                    onPress={() => handleRemoveDate(index)}
                                    isIconOnly
                                    size="sm"
                                    className="rounded-full"
                                >
                                    X
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <Input
                            label="عدد المقاعد"
                            type="number"
                            min="1"
                            placeholder="عدد المقاعد"
                            isInvalid={!validations.dates.isValid}
                            value={date.capacity}
                            onChange={(e) => {
                                handleDateChange(index, "capacity", e.target.value);
                            }}
                            />
                        </div>
                    </div>
                    ))}
                    <Button color="primary" onPress={handleAddDate}>
                    أضف تاريخ جديد
                    </Button>
                </div>

                {/* Packages Section */}
                <div className="flex flex-col gap-4 mt-6">
                    <div className="text-lg font-bold">الباقات</div>
                    {packages.map((pkg, index) => (
                    <div key={index} className="grid grid-cols-7 gap-4 items-center">
                        <Input
                        className="col-span-3"
                        label="اسم الباقة"
                        placeholder="اسم الباقة"
                        isInvalid={!validations.packages.isValid}
                        errorMessage={validations.packages.message}
                        value={pkg.title}
                        onChange={(e) => {
                            handlePackageChange(index, "title", e.target.value);
                        }}
                        />
                        <Input
                        className="col-span-3"
                        label="السعر"
                        type="number"
                        placeholder="السعر"
                        isInvalid={!validations.packages.isValid}
                        errorMessage={validations.packages.message}
                        value={pkg.price}
                        onChange={(e) => {
                            handlePackageChange(index, "price", e.target.value);
                        }}
                        />
                        <Button
                        color="danger"
                        onPress={() => handleRemovePackage(index)}
                        isIconOnly
                        size="sm"
                        className="rounded-full"
                        >
                        X
                        </Button>
                    </div>
                    ))}
                    <Button color="primary" onPress={handleAddPackage}>
                    أضف باقة جديدة
                    </Button>
                </div>
                                
                {/* Image Upload Section */}
                <div className="flex flex-col gap-4 mt-6">
                    <div className="text-lg font-bold">صورة الرحلة</div>
                    <div className="flex items-center gap-4">
                        <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="imageUpload"
                            disabled={isUploading}
                        />
                        <label 
                            htmlFor="imageUpload" 
                            className={`bg-primary text-white px-4 py-2 rounded-lg cursor-pointer  hover:opacity-80 transition-all
                                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? 'جاري الرفع...' : 'رفع صورة'}
                        </label>
                        
                        {imagePreview && (
                            <div className="relative">
                                <img 
                                    src={imagePreview} 
                                    alt="Travel Preview" 
                                    className="w-32 h-32 object-cover rounded"
                                />
                                <Button 
                                    color="danger" 
                                    size="sm" 
                                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full"
                                    onPress={handleRemoveImage}
                                    isDisabled={isUploading}
                                >
                                    X
                                </Button>
                            </div>
                        )}
                    </div>
                    {!validations.image.isValid && (
                        <p className="text-danger text-sm">{validations.image.message}</p>
                    )}
                </div>
                </form>
            </ModalBody>
            <ModalFooter className="flex justify-center mt-4">
                <Button color="danger" variant="light" onPress={onClose} isDisabled={isUploading}>
                إلغاء
                </Button>
                <Button 
                    color="primary" 
                    onPress={handleSubmit} 
                    isDisabled={isUploading}
                >
                    {isUploading ? 'جاري النشر...' : (isEdit?'تعديل':'نشر')}
                </Button>
            </ModalFooter>
            </>
        </ModalContent>
        </Modal>
    );
};

export default AddTravelModal;