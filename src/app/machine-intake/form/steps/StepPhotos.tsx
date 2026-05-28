import ImageUploadField from "@/components/ui/ImageUploadField/ImageUploadField";
import InfoBox from "@/components/ui/InfoBox/InfoBox";

type Props = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onDuplicatesSkipped: (names: string[]) => void;
  isSubmitting: boolean;
  uploadProgress: number | null;
};

export default function StepPhotos({
  files,
  onFilesChange,
  onDuplicatesSkipped,
  isSubmitting,
  uploadProgress,
}: Props) {
  return (
    <div className="space-y-5">
      <ImageUploadField
        label="Upload photos of the machine"
        files={files}
        onFilesChange={onFilesChange}
        onDuplicatesSkipped={onDuplicatesSkipped}
        multiple
        maxFiles={5}
        maxFileSizeMb={15}
        maxWidth={1600}
        maxHeight={1600}
        compressionQuality={0.82}
        uploadProgress={isSubmitting ? uploadProgress : null}
        hint="Upload from your device, drag and drop images, or use your camera. Images are optimized automatically before submission."
      />

      <InfoBox>
        Photos help us identify visible damage, missing parts, display errors, and overall machine
        condition faster.
      </InfoBox>
    </div>
  );
}
