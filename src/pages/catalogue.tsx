import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useIsMobile } from "../hooks/use-is-mobile";

const Catalogue: React.FC = () => {
  const isMobile = useIsMobile();
  const [groupedData, setGroupedData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("catalogue").select("*").order("categorie", { ascending: true });
      if (data) {
        const grouped = data.reduce((acc: any, item: any) => {
          if (!acc[item.categorie]) acc[item.categorie] = [];
          acc[item.categorie].push(item);
          return acc;
        }, {});
        setGroupedData(grouped);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="catalogue-wrapper">
      <div className="catalogue-header">
        <h1>Nos Prestations</h1>
        <div style={{ width: "60px", height: "2px", background: "#d4af37", margin: "0 auto 30px" }}></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        {Object.keys(groupedData).map((cat) => (
          <div key={cat} className="category-card">
            <h2 style={{ color: "#a67c00", fontSize: "1.4rem", textTransform: "uppercase", marginBottom: "20px", borderBottom: "1px solid #f0e6d2", paddingBottom: "10px" }}>{cat}</h2>
            {groupedData[cat].map((item: any) => (
              <div key={item.id} className="service-item">
                <div style={{ flex: 1 }}>
                  <span className="service-name">{item.service}</span>
                  {item.duree && <span style={{ display: "block", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>{item.duree}</span>}
                </div>
                <span className="service-price">{item.prix}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogue;

