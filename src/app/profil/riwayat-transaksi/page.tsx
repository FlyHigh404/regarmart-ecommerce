"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RiwayatTransaksiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("riwayat-transaksi/transaksi-diproses");
  }, [router]);

  return null;
}
