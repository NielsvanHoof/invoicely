<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * The disk to use for file storage.
     */
    protected string $disk = 's3';

    /**
     * Store a file.
     *
     * @param  UploadedFile  $file  The file to store
     * @param  int  $userId  The user ID
     * @param  string  $directory  The directory to store the file in (e.g., 'invoices', 'documents')
     * @return string|null The file path
     */
    public function storeFile(UploadedFile $file, int $userId, string $directory): ?string
    {
        $fileName = time().'_'.$file->getClientOriginalName();

        return Storage::disk($this->disk)->putFileAs(
            $directory.'/'.$userId,
            $file,
            $fileName
        );
    }

    /**
     * Delete a file.
     *
     * @param  string|null  $filePath  The file path
     * @return bool True if the file was deleted, false otherwise
     */
    public function deleteFile(?string $filePath): bool
    {
        if (! $filePath) {
            return false;
        }

        return Storage::disk($this->disk)->delete($filePath);
    }

    /**
     * Handle file replacement.
     */
    public function handleFileUpdate(
        ?string $currentFilePath,
        ?UploadedFile $newFile,
        bool $removeFile,
        int $userId,
        string $directory
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

            return $this->storeFile($newFile, $userId, $directory);
        }

        return $currentFilePath;
    }

    /**
     * Generate a temporary signed URL for a file.
     *
     * @param  string|null  $filePath  The file path
     * @param  int  $expirationMinutes  Number of minutes until the URL expires
     * @return string|null The signed URL or null if file path is null
     */
    public function getTemporaryUrl(?string $filePath, int $expirationMinutes = 60): ?string
    {
        if (! $filePath) {
            return null;
        }

        try {
            return Storage::disk($this->disk)->temporaryUrl(
                $filePath,
                now()->addMinutes($expirationMinutes)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to generate temporary URL: '.$e->getMessage(), [
                'file_path' => $filePath,
                'exception' => $e,
            ]);

            return null;
        }
    }
} 