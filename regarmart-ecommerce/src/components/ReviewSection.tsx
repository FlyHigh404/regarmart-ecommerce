"use client";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  profileImage: string;
  date: string;
  rating: number;
  review: string;
  adminReply?: {
    name: string;
    role: string;
    date: string;
    message: string;
  };
}

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] p-6 m-6">
      {reviews.map((item, index) => (
        <div key={item.id} className="pb-6">
          {/* Header user */}
          <div className="flex items-start gap-4">
            {/* Foto profil */}
            <div
              className="w-[41.916px] h-[41.916px] rounded-full bg-gray-200 flex-shrink-0"
              style={{
                backgroundImage: `url(${item.profileImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            <div className="flex flex-col w-full">
              {/* Nama & rating */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-[#16151C] font-['Plus Jakarta Sans'] text-[18px] font-medium">
                  {item.name}
                </h3>
                <span className="text-[#6D706E] text-[10px] font-['Plus Jakarta Sans'] font-medium mt-1 sm:mt-0">
                  {item.date}
                </span>
              </div>

              {/* Bintang */}
              <div className="flex items-center mt-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-[14px] h-[14px] fill-[#26A81D] text-[#26A81D]"
                  />
                ))}
              </div>

              {/* Isi ulasan */}
              <p className="text-[#6D706E] font-['Plus Jakarta Sans'] text-[14px] font-semibold mt-2">
                {item.review}
              </p>

              {/* Balasan admin */}
              {item.adminReply && (
                <div className="mt-4 bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[#16151C] font-['Plus Jakarta Sans'] text-[14px] font-semibold">
                        {item.adminReply.name}
                      </span>
                      <span className="bg-[#E6F3E6] text-[#26A81D] text-xs px-2 py-[2px] rounded-md font-medium">
                        {item.adminReply.role}
                      </span>
                    </div>
                    <span className="text-[#6D706E] text-[10px] font-['Plus Jakarta Sans'] font-medium">
                      {item.adminReply.date}
                    </span>
                  </div>
                  <p className="text-[#6D706E] text-[13px] leading-snug">
                    {item.adminReply.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Garis pemisah */}
          {index !== reviews.length - 1 && (
            <div className="w-[1047.61px] h-[1px] bg-[#E5E5E5] mt-6 mx-auto"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;