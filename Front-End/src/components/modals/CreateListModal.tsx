import React, { useState, useRef, useEffect } from "react";
import { MarketplaceListing } from "../../types";
import { Avatar, Button } from "../ui";
import { useCurrentUser } from "../../context/CurrentUserContex";
import { useListings } from "../../context/ListingContext";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  X,
  MapPin,
  CircleAlert,
  ArrowRight,
} from "lucide-react";

interface CreateListModalProps {
  onClose: () => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [address, setAddress] = useState("");
  const { setListings } = useListings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [condition, setCondition] =
    useState<MarketplaceListing["condition"]>("good");
  const [category, setCategory] =
    useState<MarketplaceListing["category"]>("other");
      const { currentUser } = useCurrentUser();
      if (!currentUser) return null;

  const handleCreateList = () => {
    if (!title.trim() || !address.trim()) return;
    const newList: MarketplaceListing = {
      id: `m${Date.now()}`,
      title,
      description,
      price,
      condition,
      category,
      sold: false,
      images: imagePreview,
      address,
      seller: currentUser,
      createdAt: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    };
    setListings((prev) => [newList, ...prev]);
    onClose();
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const handleFiles = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemove = () => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== currentImage));
    setImagePreview((prev) => prev.filter((_, i) => i !== currentImage));
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border flex flex-col md:flex-row md:mt-13 gap-3 md:gap-5 border-border-accent rounded-0 md:rounded-md p-4 md:w-[900px] w-full h-[87vh] md:h-[90vh] md:mt-[60px] mt-[120px] animate-scaleIn shadow-2xl overflow-hidden"
      >
        <div
          className={`border rounded-2xl w-full md:w-[50%] h-[35vh] md:h-full flex flex-col overflow-hidden shadow-inner transition-colors ${
            isDragging
              ? "bg-brand/10 border-brand"
              : "bg-base-surface border-border"
          }`}
          onDragEnter={() => {
            dragCounter.current += 1;
            setIsDragging(true);
          }}
          onDragLeave={() => {
            dragCounter.current -= 1;
            if (dragCounter.current === 0) setIsDragging(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setIsDragging(false);
            handleFiles(Array.from(e.dataTransfer.files));
          }}
        >
          {selectedImages.length === 0 && (
            <div
              className="flex-1 flex flex-col items-center justify-center gap-2 group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
            >
              <div
                className={`p-4 active:scale-[80%] rounded-2xl bg-base-elevated border shadow-sm group-hover:border-brand/40 transition-colors ${isDragging ? "border-brand" : "border-border"}`}
              >
                <ImagePlus
                  size={48}
                  className={`transition-colors ${isDragging ? "text-brand" : "text-text-muted group-hover:text-brand"}`}
                />
              </div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                {isDragging ? "Drop here" : "Add photos or drag it here"}
              </p>
              <p className="text-[10px] text-text-muted/60">
                JPG, PNG supported
              </p>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="relative w-full flex-1 overflow-hidden">
              <button
                className="absolute z-[100] top-2 left-1/2 -translate-x-1/2 hover:scale-[105%] active:scale-[90%]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <div className="border-2 border-orange-500 bg-black/60 text-orange-500 px-2 rounded-md">
                  remove
                </div>
              </button>
              <img
                src={imagePreview[currentImage]}
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-70"
                alt=""
              />
              <img
                src={imagePreview[currentImage]}
                className="relative z-10 w-full h-full object-contain"
                alt=""
              />

              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) =>
                        prev === 0 ? selectedImages.length - 1 : prev - 1,
                      );
                    }}
                    className="group absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center z-30 active:scale-90"
                  >
                    <div className="border-2 bg-black/60 border-orange-500 rounded-full w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                      <ChevronLeft size={22} className="text-orange-500" />
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) =>
                        prev === selectedImages.length - 1 ? 0 : prev + 1,
                      );
                    }}
                    className="group absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center z-30 active:scale-90"
                  >
                    <div className="border-2 bg-black/60 border-orange-500 rounded-full w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                      <ChevronRight size={22} className="text-orange-500" />
                    </div>
                  </button>
                </>
              )}

              {selectedImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {selectedImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(i);
                      }}
                      className={`w-2 h-1.5 rounded-full transition-all ${i === currentImage ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedImages.length > 0 && (
            <div
              className="flex flex-row justify-center py-4 items-center gap-2 group shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
            >
              <div
                className={`p-4 active:scale-[80%] rounded-2xl bg-base-elevated border shadow-sm group-hover:border-brand/40 transition-colors ${isDragging ? "border-brand" : "border-border"}`}
              >
                <ImagePlus
                  size={32}
                  className={`transition-colors ${isDragging ? "text-brand" : "text-text-muted group-hover:text-brand"}`}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  {isDragging ? "Drop here" : "Add more photos"}
                </p>
                <p className="text-[10px] text-text-muted/60">
                  {selectedImages.length} photo
                  {selectedImages.length > 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
          )}

          <input
            className="hidden pointer-events-none"
            type="file"
            multiple
            ref={fileRef}
            onChange={(e) => {
              if (e.target.files) handleFiles(Array.from(e.target.files));
            }}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Create a Listing
              </h2>
              <p className="text-[11px] text-text-muted">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-text-muted text-[13px] items-center flex hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
            >
              Back<ArrowRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2.5 mb-5 p-3 bg-base-surface border border-border rounded-xl">
            <Avatar initials={currentUser.avatar} size="md" />
            <div>
              <div className="text-[13px] font-semibold text-text-primary">
                {currentUser.firstname}
              </div>
              <div className="text-[10px] text-text-muted">
                {currentUser.university} · {currentUser.program}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Title
              </span>
              <div className="relative">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you selling?"
                  className="input-base font-medium pr-8"
                />
                {!title && (
                  <CircleAlert
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item..."
                rows={4}
                className="input-base resize-none"
              />
            </div>

            <div className="flex gap-2.5">
              <div className="relative flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  Price
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-bold">
                    ₱
                  </span>
                  <input
                    value={price}
                    onChange={(e) =>
                      setPrice(Number(e.target.value.replace(/\D/g, "")))
                    }
                    className="input-base pl-7"
                  />
                </div>
              </div>

              <div className="relative flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  Condition
                </span>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) =>
                      setCondition(
                        e.target.value as MarketplaceListing["condition"],
                      )
                    }
                    className="input-base appearance-none w-full pr-8"
                  >
                    <option value="brand-new">Brand New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="used">Used</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Address
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <MapPin size={14} />
                </span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-base pl-9 pr-8"
                  placeholder="Enter your address"
                />
                {!address && (
                  <CircleAlert
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  />
                )}
              </div>
            </div>

            <div className="relative flex flex-col gap-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                Category
              </span>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as MarketplaceListing["category"],
                    )
                  }
                  className="input-base appearance-none w-full pr-8"
                >
                  <option value="books">Books</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="notes">Notes</option>
                  <option value="supplies">Supplies</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2.5 justify-end border-t border-border mt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!title.trim() || !address.trim()}
              onClick={handleCreateList}
            >
              List Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;
