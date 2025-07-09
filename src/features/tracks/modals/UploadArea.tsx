import { Upload } from 'lucide-react';

function UploadArea({
  handleFileChange,
  fileInputRef,
}: {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-8 h-8 mb-2" />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-muted-foreground">
          MP3, WAV, M4A (max 50MB)
        </p>
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".mp3,.wav,.m4a"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </label>
  );
}
export default UploadArea;
