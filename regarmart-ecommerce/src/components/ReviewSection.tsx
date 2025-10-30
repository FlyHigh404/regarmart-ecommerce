"use client";

interface Review {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image?: string | null;
  };
  reply?: string | null;
  replyBy?: string | null;
  admin?: {
    name: string;
    role?: string;
  } | null;
}

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get default profile image
  const getProfileImage = (image: string | null | undefined) => {
    return image || "/default-avatar.png";
  };

  return (
    <div className="bg-white rounded-xl shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] p-6 m-6">
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#6D706E] font-['Plus Jakarta Sans'] text-[16px] font-semibold">
            Belum ada ulasan untuk produk ini
          </p>
        </div>
      ) : (
        reviews.map((item, index) => (
          <div key={item.id} className="pb-6">
            {/* Header user */}
            <div className="flex items-start gap-4">
              {/* Foto profil */}
              <div
                className="w-[41.916px] h-[41.916px] rounded-full bg-gray-200 flex-shrink-0 overflow-hidden"
                style={{
                  backgroundImage: `url(${getProfileImage(item.user.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="flex flex-col w-full">
                {/* Nama & tanggal */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-[#16151C] font-['Plus Jakarta Sans'] text-[18px] font-medium">
                    {item.user.name}
                  </h3>
                  <span className="text-[#6D706E] text-[10px] font-['Plus Jakarta Sans'] font-medium mt-1 sm:mt-0">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Bintang - Note: Rating tidak tersedia di API, jadi kita skip atau gunakan default */}
                {/* 
                <div className="flex items-center mt-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-[14px] h-[14px] fill-[#26A81D] text-[#26A81D]"
                    />
                  ))}
                </div>
                */}

                {/* Isi ulasan */}
                <p className="text-[#6D706E] font-['Plus Jakarta Sans'] text-[14px] font-semibold mt-2">
                  {item.content}
                </p>

                {/* Balasan admin */}
                {item.reply && (
                  <div className="mt-4 bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[#16151C] font-['Plus Jakarta Sans'] text-[14px] font-semibold">
                          {item.admin?.name || "Admin"}
                        </span>
                        <span className="bg-[#E6F3E6] text-[#26A81D] text-xs px-2 py-[2px] rounded-md font-medium">
                          {item.admin?.role || "Admin"}
                        </span>
                      </div>
                      <span className="text-[#6D706E] text-[10px] font-['Plus Jakarta Sans'] font-medium">
                        {item.replyBy ? formatDate(item.replyBy) : "Baru saja"}
                      </span>
                    </div>
                    <p className="text-[#6D706E] text-[13px] leading-snug">
                      {item.reply}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Garis pemisah */}
            {index !== reviews.length - 1 && (
              <div className="w-full h-[1px] bg-[#E5E5E5] mt-6 mx-auto"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewSection;