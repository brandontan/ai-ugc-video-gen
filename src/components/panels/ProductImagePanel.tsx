const tabs = [
  { id: 'upload', label: 'Upload' },
  { id: 'prompt', label: 'Prompt' }
];

{activeTab === 'upload' && (
  <div className="space-y-4">
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Product preview"
          fill
          className="object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-gray-500">No image selected</span>
        </div>
      )}
      {previewUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
          <button
            onClick={handleClearImage}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
    <div className="flex justify-center">
      <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  </div>
)}

{activeTab === 'prompt' && (
  <div className="space-y-4">
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Product preview"
          fill
          className="object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-gray-500">No image generated</span>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Prompt
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your product image..."
        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
        rows={3}
      />
    </div>
    <div className="flex justify-end">
      <button
        onClick={handleGenerateImage}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Generate Image
      </button>
    </div>
  </div>
)} 