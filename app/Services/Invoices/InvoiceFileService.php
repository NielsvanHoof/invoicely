<?php

namespace App\Services\Invoices;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class InvoiceFileService
{
    /**
     * The disk to use for file storage.
     */
    protected string $disk = 's3';

    /**
     * Store an invoice file.
     *
     * @return string|null The file path
     */
    public function storeFile(UploadedFile $file, int $userId): ?string
    {
        $fileName = time().'_'.$file->getClientOriginalName();

        return Storage::disk($this->disk)->putFileAs(
            'invoices/'.$userId,
            $file,
            $fileName
        );
    }

    /**
     * Delete an invoice file.
     */
    public function deleteFile(?string $filePath): bool
    {
        if (! $filePath) {
            return false;
        }

        return Storage::disk($this->disk)->delete($filePath);
    }

    /**
     * Handle file replacement for an invoice.
     */
    public function handleFileUpdate(
        ?string $currentFilePath,
        ?UploadedFile $newFile,
        bool $removeFile,
        int $userId
    ): ?string {
        // Handle file removal if requested
        if ($removeFile && $currentFilePath) {
            $this->deleteFile($currentFilePath);

            return null;
        }

        // Handle new file upload
        if ($newFile) {
            // Delete old file if exists
            if ($currentFilePath) {
                $this->deleteFile($currentFilePath);
            }

            return $this->storeFile($newFile, $userId);
        }

        return $currentFilePath;
    }
}
