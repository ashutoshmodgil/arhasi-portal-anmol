'use client';

import useUploadImage from '@/api/hooks/useUploadImage';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Camera,
  ChevronDown,
  Crop,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface IProps{
  setSelectedImage: React.Dispatch<React.SetStateAction<{
  image: string | ArrayBuffer | null;
  file: any;
}>>
selectedImage: {
  image: string | ArrayBuffer | null;
  file: any;
}
}

const LogoComponent = (props:IProps) => {
  const { dashboard_id } = useParams();
  const [isLogoOpen, setIsLogoOpen] = useState(true);
  // const [selectedImage, setSelectedImage] = useState<{
  //   image: string | ArrayBuffer | null;
  //   file: any;
  // }>({
  //   image: null,
  //   file: null,
  // }); // State for the selected image
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop

  const { mutate: mutateImageUpload } = useUploadImage({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setSelectedImage({ image: reader.result, file }); // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setSelectedImage(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Handler for the Cancel button
  const handleCancel = () => {
    props.setSelectedImage(null); // Reset the selected image
  };

  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append('file', props.selectedImage.file!);

    mutateImageUpload({
      dashboard_id: dashboard_id!,
      formData,
    });
  };

  return (
    <Card className='w-full sm:w-1/2 border-[#3D494A] bg-secondary text-white'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-bold'>
          <Collapsible>
            <CollapsibleTrigger
              onClick={() => setIsLogoOpen(!isLogoOpen)}
              className='flex items-center font-bold text-xl'
            >
              Logo <ChevronDown className='ml-2 h-4 w-4' />
            </CollapsibleTrigger>
          </Collapsible>
        </CardTitle>
        <Button
          variant='ghost'
          size='icon'
          className='text-white bg-primary rounded-md'
          onClick={()=>{}}
        >
          <Upload className='h-4 w-4' />
        </Button>
      </CardHeader>
      <Collapsible open={isLogoOpen}>
        <CollapsibleContent>
          <CardContent className='space-y-4'>
            <div
              className={`border-2 ${
                isDragging ? 'border-blue-500' : 'border-dashed border-gray-600'
              } rounded-lg p-8 flex flex-col items-center justify-center space-y-2`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Image Preview */}
              <div className='bg-secondary-background p-4 rounded-full'>
                {props.selectedImage ? (
                  <img
                    src={props.selectedImage.image}
                    alt='Logo Preview'
                    className='h-16 w-16 object-cover rounded-full'
                  />
                ) : (
                  <Camera className='h-8 w-8 text-gray-400' />
                )}
              </div>
              <p className='text-sm text-gray-400'>or Drag and Drop here</p>
              <p className='text-xs text-gray-500'>PNG, JPEG, SVG</p>
              {/* File Input */}
              <input
                type='file'
                accept='image/png, image/jpeg, image/svg+xml'
                onChange={handleImageChange}
                className='hidden'
                id='logo-upload'
              />
              <label
                htmlFor='logo-upload'
                className='cursor-pointer text-blue-500 underline'
              >
                Select Image
              </label>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between items-end'>
            <div className='flex space-x-2'>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full bg-secondary-background'
              >
                <Crop className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full bg-secondary-background'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full bg-secondary-background'
              >
                <Settings className='h-4 w-4' />
              </Button>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='text-white bg-transparent border-gray-600'
              onClick={handleCancel} // Attach the cancel handler
            >
              Cancel
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default LogoComponent;
