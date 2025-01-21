import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { getLabRequests, getImagingRequests, getCompletedLabRequestAll, getTechniciansLabRequestAll, getTechniciansImagingRequestAll, getCompletedImagingRequestAll, getTechniciansPendingLabRequestAll } from '../../services/technicians-service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-hot-toast';

const TechniciansMainDashboard = () => {
  // Responsive breakpoint'ler
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isExtraSmall = useMediaQuery({ maxWidth: 530 });
  const isLargeScreen = useMediaQuery({ minWidth: 1590 });
  const isExtraLarge = useMediaQuery({ minWidth: 1540 });

  // Responsive stil değişkenleri
  const containerPadding = isExtraSmall ? 'p-2' : isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6';
  const titleSize = isExtraSmall ? 'text-lg' : isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl';
  const cardPadding = isExtraSmall ? 'p-2' : isMobile ? 'p-3' : 'p-4';
  const cardTitleSize = isExtraSmall ? 'text-sm' : isMobile ? 'text-base' : 'text-lg';
  const cardValueSize = isExtraSmall ? 'text-xl' : isMobile ? 'text-2xl' : 'text-3xl';
  const chartHeight = isExtraSmall ? 'h-48' : isMobile ? 'h-56' : isTablet ? 'h-64' : 'h-80';
  const gridCols = isDesktop ? 'lg:grid-cols-4' : isTablet ? 'md:grid-cols-2' : 'grid-cols-1';

  // Pasta grafik ayarları
  const pieChartConfig = {
    outerRadius: isExtraSmall ? 45 : isMobile ? 60 : isTablet ? 70 : isLargeScreen ? 100 : 80,
    fontSize: isLargeScreen ? 12 : isDesktop ? 10 : 8
  };

  const [labStats, setLabStats] = useState({
    totalRequests: 0,
    completedRequests: 0,
    testTypeDistribution: []
  });

  const [imagingStats, setImagingStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    imagingTypeDistribution: []
  });

  const [pendingLabRequests, setPendingLabRequests] = useState([]);

  const [totalRequests, setTotalRequests] = useState({
    labRequests: [],
    imagingRequests: []
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const testPanelMapping = {
    'TAM_KAN_SAYIMI': 'Tam Kan Sayımı',
    'HORMON_TESTLERI': 'Hormon Testleri',
    'BIYOKIMYA': 'Biyokimya',
    'IDRAR_TAHLILI': 'İdrar Tahlili',
    'KOAGULASYON': 'Koagülasyon',
    'SEDIMANTASYON': 'Sedimantasyon',
    'CRP': 'CRP'
  };

  const imagingTypeMapping = {
    'XRAY': 'Röntgen',
    'MRI': 'MR',
    'CT': 'Tomografi',
    'USG': 'Ultrason',
    'EKG': 'EKG',
    'ULTRASOUND': 'Ultrason'
  };

  useEffect(() => {
    // İlk yüklemede verileri getir
    fetchStats();
    fetchPendingLabRequests();
    fetchTotalRequests();
  }, []);

  const fetchTotalRequests = async () => {
    try {
      const [allLabRequests, allImagingRequests] = await Promise.all([
        getTechniciansLabRequestAll(),
        getTechniciansImagingRequestAll()
      ]);

      console.log('Tüm lab istekleri:', allLabRequests);
      console.log('Tüm görüntüleme istekleri:', allImagingRequests);

      setTotalRequests({
        labRequests: allLabRequests,
        imagingRequests: allImagingRequests
      });
    } catch (error) {
      console.error('Toplam istekler yüklenirken hata oluştu:', error);
      toast.error('Toplam istekler yüklenirken bir hata oluştu');
    }
  };

  const fetchStats = async () => {
    try {
      // Tüm istekleri al
      const [
        labRequests, 
        completedLabRequests, 
        allLabRequests, 
        allImagingRequests,
        completedImagingRequests
      ] = await Promise.all([
        getLabRequests(),
        getCompletedLabRequestAll(),
        getTechniciansLabRequestAll(),
        getTechniciansImagingRequestAll(),
        getCompletedImagingRequestAll()
      ]);

      console.log('Güncel lab istekleri:', labRequests);
      console.log('Tamamlanan lab istekleri:', completedLabRequests);
      console.log('Tüm lab istekleri:', allLabRequests);
      console.log('Tüm görüntüleme istekleri:', allImagingRequests);
      console.log('Tamamlanan görüntüleme istekleri:', completedImagingRequests);

      // Test tipi dağılımını hesapla
      const testTypeCounts = {};
      labRequests.forEach(req => {
        const testType = testPanelMapping[req.testPanel] || 'Diğer';
        testTypeCounts[testType] = (testTypeCounts[testType] || 0) + 1;
      });

      const labStatsData = {
        totalRequests: allLabRequests.length + allImagingRequests.length, // Tüm lab ve görüntüleme istekleri toplamı
        completedRequests: completedLabRequests.length + completedImagingRequests.length, // Tamamlanan lab ve görüntüleme istekleri toplamı
        testTypeDistribution: Object.entries(testTypeCounts).map(([name, value]) => ({
          name,
          value
        }))
      };

      console.log('Hesaplanan lab istatistikleri:', labStatsData);
      setLabStats(labStatsData);

      // Görüntüleme isteklerini al
      const imagingRequests = await getImagingRequests();
      console.log('Güncel görüntüleme istekleri:', imagingRequests);
      const imagingStatsData = calculateImagingStats(imagingRequests);
      console.log('Hesaplanan görüntüleme istatistikleri:', imagingStatsData);
      setImagingStats(imagingStatsData);

    } catch (error) {
      console.error('İstatistikler yüklenirken hata oluştu:', error);
      toast.error('İstatistikler yüklenirken bir hata oluştu');
    }
  };

  const fetchPendingLabRequests = async () => {
    try {
      const response = await getTechniciansPendingLabRequestAll();
      console.log('Bekleyen lab istekleri:', response);
      setPendingLabRequests(response);
    } catch (error) {
      console.error('Bekleyen lab istekleri yüklenirken hata oluştu:', error);
      toast.error('Bekleyen lab istekleri yüklenirken bir hata oluştu');
    }
  };

  const calculateImagingStats = (requests) => {
    console.log('Görüntüleme istekleri hesaplanıyor:', requests);
    
    // Her bir isteğin durumunu kontrol et ve logla
    requests.forEach(req => {
      console.log(`Görüntüleme isteği ID: ${req.id}, Status: ${req.status}, Imaging Type: ${req.imagingType}`);
    });

    // Status değerlerini kontrol et (büyük-küçük harf duyarlılığını kaldır)
    const pendingCount = requests.filter(req => {
      const status = (req.status || '').toUpperCase();
      return status === 'PENDING' || 
             status === 'IN_PROGRESS' || 
             status === 'WAITING' || 
             status === 'NEW';
    }).length;

    const completedCount = requests.filter(req => {
      const status = (req.status || '').toUpperCase();
      return status === 'COMPLETED' || 
             status === 'DONE' || 
             status === 'FINISHED';
    }).length;
    
    console.log('Bekleyen görüntüleme istekleri:', pendingCount);
    console.log('Tamamlanan görüntüleme istekleri:', completedCount);
    console.log('Farklı status değerleri:', [...new Set(requests.map(req => req.status))]);

    const stats = {
      totalRequests: requests.length,
      pendingRequests: pendingCount,
      completedRequests: completedCount,
      imagingTypeDistribution: []
    };

    // Görüntüleme tipi dağılımını hesapla
    const imagingTypeCounts = {};
    requests.forEach(req => {
      const imagingType = imagingTypeMapping[req.imagingType] || 'Diğer';
      imagingTypeCounts[imagingType] = (imagingTypeCounts[imagingType] || 0) + 1;
    });

    stats.imagingTypeDistribution = Object.entries(imagingTypeCounts).map(([name, value]) => ({
      name,
      value
    }));

    return stats;
  };

  const statusData = [
    {
      name: 'Laboratuvar',
      Bekleyen: pendingLabRequests.length,
      Tamamlanan: labStats.completedRequests,
    },
    {
      name: 'Görüntüleme',
      Bekleyen: imagingStats.pendingRequests,
      Tamamlanan: imagingStats.completedRequests,
    },
  ];

  return (
    <div className={`${containerPadding} ${isExtraLarge ? 'overflow-x-auto' : ''}`}>
      <h1 className={`${titleSize} font-bold mb-6`}>
        Teknisyen Dashboard
      </h1>
      
      {/* İstatistik Kartları */}
      <div className={`grid ${gridCols} gap-4 mb-6`}>
        <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`${cardTitleSize} font-semibold mb-2`}>
            Toplam İstekler
          </h3>
          <p className={`${cardValueSize} font-bold text-blue-600`}>
            {totalRequests.labRequests.length + totalRequests.imagingRequests.length}
          </p>
        </div>
        <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`${cardTitleSize} font-semibold mb-2`}>
            Görüntülemede Bekleyen İstekler
          </h3>
          <p className={`${cardValueSize} font-bold text-green-600`}>
            {imagingStats.totalRequests}
          </p>
        </div>
        <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`${cardTitleSize} font-semibold mb-2`}>
            Laboratuvarda Bekleyen İstekler
          </h3>
          <p className={`${cardValueSize} font-bold text-yellow-600`}>
            {pendingLabRequests.length}
          </p>
        </div>
        <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`${cardTitleSize} font-semibold mb-2`}>
            Tamamlanan İstekler
          </h3>
          <p className={`${cardValueSize} font-bold text-purple-600`}>
            {labStats.completedRequests}
          </p>
        </div>
      </div>

      {/* Grafikler */}
      <div className={`flex flex-col gap-6`}>
        {/* Üst Grafikler */}
        <div className={`grid ${!isExtraLarge ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
          {/* Durum Dağılımı Grafiği */}
          <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
            <h3 className={`${cardTitleSize} font-semibold mb-4`}>
              İstek Durumları
            </h3>
            <div className={chartHeight}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={isExtraSmall ? 8 : isMobile ? 10 : 12} />
                  <YAxis fontSize={isExtraSmall ? 8 : isMobile ? 10 : 12} />
                  <Tooltip />
                  <Legend wrapperStyle={isExtraSmall ? { fontSize: '8px' } : isMobile ? { fontSize: '10px' } : { fontSize: '12px' }} />
                  <Bar dataKey="Bekleyen" fill="#FFBB28" />
                  <Bar dataKey="Tamamlanan" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Tipi Dağılımı */}
          <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg`}>
            <h3 className={`${cardTitleSize} font-semibold mb-4`}>
              Test Tipi Dağılımı
            </h3>
            <div className={chartHeight}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={labStats.testTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={pieChartConfig.outerRadius}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                    fontSize={pieChartConfig.fontSize}
                  >
                    {labStats.testTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {isExtraSmall ? (
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '8px', paddingTop: '10px' }}
                    />
                  ) : isMobile ? (
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconSize={10}
                      wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }}
                    />
                  ) : (
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconSize={12}
                      wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                    />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Alt Grafik - Görüntüleme Tipi Dağılımı */}
        <div className={`bg-white ${cardPadding} rounded-lg shadow transition-all duration-300 hover:shadow-lg ${isExtraLarge ? 'w-1/2 mx-auto' : 'w-full'}`}>
          <h3 className={`${cardTitleSize} font-semibold mb-4`}>
            Görüntüleme Tipi Dağılımı
          </h3>
          <div className={`${chartHeight} ${isExtraLarge ? 'h-[550px]' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={imagingStats.imagingTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={isExtraLarge ? 200 : pieChartConfig.outerRadius}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                  fontSize={pieChartConfig.fontSize}
                >
                  {imagingStats.imagingTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {isExtraSmall ? (
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '8px', paddingTop: '10px' }}
                  />
                ) : isMobile ? (
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }}
                  />
                ) : (
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={12}
                    wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniciansMainDashboard;