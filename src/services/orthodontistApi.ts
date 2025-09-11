interface Orthodontist {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface OrthodontistResponse {
  orthodontists: Orthodontist[];
  total: number;
}

interface City {
  id: string;
  name: string;
}

export class OrthodontistService {
  private static readonly API_BASE_URL = 
  (typeof window !== 'undefined' && (window as any).OrthoInsightConfig?.proxyBase)
    ? (window as any).OrthoInsightConfig.proxyBase
    : '/api';


  
  static async findNearbyOrthodontists(
    latitude: number,
    longitude: number,
    distance: number = 50
  ): Promise<OrthodontistResponse> {
    try {
      const url = `${this.API_BASE_URL}near-clinic`;
      const body = {
        location: { lng: Number(longitude), lat: Number(latitude) },
        radius: Number(distance) * 1000,
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`near-clinic POST failed: ${res.status} ${res.statusText} - ${errText}`);
      }
      const raw = await res.json();
      return this.normalizeResponse(raw?.result ?? raw);
    } catch (error) {
      console.error('Orthodontist API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch orthodontists');
    }
  }

  // Normalize various backend shapes into our OrthodontistResponse
  private static normalizeResponse(raw: any): OrthodontistResponse {
    try {
      const base = typeof raw === 'string' ? JSON.parse(raw) : raw;
      // Unwrap common { result } or { result: { result } } envelopes
      const data1 = base?.result !== undefined ? base.result : base;
      const data = data1?.result !== undefined ? data1.result : data1;

      const list: any[] = Array.isArray(data)
        ? data
        : data?.orthodontists || data?.clinics || data?.results || data?.data || [];

      const mapNum = (v: any): number => {
        if (typeof v === 'number') return v;
        const n = parseFloat(String(v));
        return Number.isFinite(n) ? n : 0;
      };

       const mapped: Orthodontist[] = list.map((item, idx) => {
        // Handle GeoJSON coordinates format [longitude, latitude]
        const coordinates = item?.location?.coordinates;
        const lat = coordinates?.[1] ?? item?.latitude ?? item?.lat ?? item?.y ?? item?.clinicLatitude;
        const lng = coordinates?.[0] ?? item?.longitude ?? item?.lng ?? item?.lon ?? item?.x ?? item?.clinicLongitude;
        const city = item?.city || item?.cityName || item?.town || '';
        const address =
          item?.address || item?.addressLine || [item?.street, item?.district, city].filter(Boolean).join(', ');
        const phone = item?.phone || item?.phoneNumber || item?.tel || '';
        const name = item?.name || item?.clinicName || item?.title || 'Orthodontist Clinic';
        const specialty = item?.specialty || item?.branch || 'Orthodontist';
        const distance = item?.distance ?? item?.km ?? undefined;


        return {
          id: String(item?.id || item?.clinicId || item?._id || idx),
          name,
          specialty,
          address: address || city,
          city,
          phone,
          latitude: mapNum(lat),
          longitude: mapNum(lng),
          distance: distance !== undefined ? mapNum(distance) : undefined,
        } as Orthodontist;
      });

      return { orthodontists: mapped, total: mapped.length };
    } catch (e) {
      console.warn('Ortho API: normalize failed, returning empty list', e);
      return { orthodontists: [], total: 0 };
    }
  }

  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      // İlk deneme: Yüksek doğruluk, kısa timeout
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy;
          console.log(`📍 Location accuracy: ${accuracy}m`);
          
          // Eğer doğruluk 100m'den kötüyse, ikinci deneme yap
          if (accuracy > 100) {
            console.log('🔄 Accuracy poor, trying again with longer timeout...');
            navigator.geolocation.getCurrentPosition(
              (betterPosition) => {
                const betterAccuracy = betterPosition.coords.accuracy;
                console.log(`📍 Better location accuracy: ${betterAccuracy}m`);
                resolve({
                  latitude: betterPosition.coords.latitude,
                  longitude: betterPosition.coords.longitude,
                  accuracy: betterAccuracy,
                });
              },
              (error) => {
                // İkinci deneme başarısız olursa ilk sonucu kullan
                console.warn('⚠️ Second location attempt failed, using first result');
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: accuracy,
                });
              },
              {
                enableHighAccuracy: true,
                timeout: 20000, // 20 saniye
                maximumAge: 0, // Cache kullanma
              }
            );
          } else {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: accuracy,
            });
          }
        },
        (error) => {
          // İlk deneme başarısız olursa, daha esnek ayarlarla tekrar dene
          console.warn('⚠️ First location attempt failed, trying with relaxed settings...');
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              });
            },
            (finalError) => {
              switch (finalError.code) {
                case finalError.PERMISSION_DENIED:
                  reject(new Error('Location access denied by user. Please enable location permissions in your browser settings.'));
                  break;
                case finalError.POSITION_UNAVAILABLE:
                  reject(new Error('Location information is unavailable. Please check your internet connection and GPS settings.'));
                  break;
                case finalError.TIMEOUT:
                  reject(new Error('Location request timed out. Please try again or check your GPS signal.'));
                  break;
                default:
                  reject(new Error('An unknown error occurred while retrieving location'));
                  break;
              }
            },
            {
              enableHighAccuracy: false, // Daha hızlı ama daha az doğru
              timeout: 15000,
              maximumAge: 300000, // 5 dakika cache kullan
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // İlk denemede cache kullanma
        }
      );
    });
  }
  static async getCityList(): Promise<City[]> {
    const url = `${this.API_BASE_URL}city`;
    console.log('📥 Ortho API: POST city list', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`POST city list failed: ${res.status} ${res.statusText} - ${errText}`);
    }
    const raw = await res.json();
    const dataSrc = raw?.result ?? raw;
    const data: any[] = Array.isArray(dataSrc) ? dataSrc : dataSrc?.data || dataSrc?.cities || [];
    return data.map((c: any, idx: number) => ({
      id: String(c?.id ?? c?.cityId ?? c?.code ?? idx),
      name: String(c?.name ?? c?.cityName ?? c?.title ?? ''),
    }));
  }

  static async getClinicList(params?: { cityId?: string; city?: string }): Promise<OrthodontistResponse> {
    const url = `${this.API_BASE_URL}clinic`;
    const cityVal = params?.cityId || params?.city;
    console.log('📥 Ortho API: POST clinic list', url, cityVal ? `(cityId=${cityVal})` : '');
    const body: any = {};
    if (cityVal) body.cityId = cityVal;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`POST clinic list failed: ${res.status} ${res.statusText} - ${errText}`);
    }
    const raw = await res.json();
    return this.normalizeResponse(raw?.result ?? raw);
  }

  static async getClinicNearby(
    latitude: number,
    longitude: number,
    distance: number = 50
  ): Promise<OrthodontistResponse> {
    return this.findNearbyOrthodontists(latitude, longitude, distance);
  }
}