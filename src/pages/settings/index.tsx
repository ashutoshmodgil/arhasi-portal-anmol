import { useParams } from 'react-router-dom';
import DataSourcesComponent from './components/DataSourceCard';
import SettingsHeader from './components/header';
import IntegrationCard from './components/IntegrationCard';
import SelectIntegration from './components/IntegrationComponent';
import LogoComponent from './components/LogoComponent';
import WheelColorComponent from './components/WheelColorComponent';
import { useState } from 'react';
import useUploadImage from '@/api/hooks/useUploadImage';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { dashboard_id = '' } = useParams();
  const { mutate: mutateImageUpload } = useUploadImage({
    onSuccess: () => {
      toast({ title: 'Updated Succesfully' });
    },
  });
  const [selectedImage, setSelectedImage] = useState<{
    image: string | ArrayBuffer | null;
    file: any;
  }>({
    image: null,
    file: null,
  }); 
  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append('file', selectedImage.file!);

    mutateImageUpload({
      dashboard_id: dashboard_id!,
      formData,
    });
  };
  return (
    <div className='flex flex-col gap-4 mx-4 py-4'>
      <SettingsHeader handleUploadImage={handleUploadImage}/>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='flex flex-col  gap-4 w-full'>
          <IntegrationCard />
          <div className='flex flex-col sm:flex-row gap-4'>
            <WheelColorComponent />
            <LogoComponent selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <DataSourcesComponent dashboardId={dashboard_id} />
          <SelectIntegration />
        </div>
      </div>
    </div>
  );
}
