<?php

namespace App\Actions\Files;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GetTemporaryUrlAction
{
    /**
     * The disk to use for file storage.
     */
    protected string $disk = 's3';

    /**
     * Generate a temporary signed URL for a file.
     *
     * @param  string|null  $filePath  The file path
     * @param  int  $expirationMinutes  Number of minutes until the URL expires
     * @return string|null The signed URL or null if file path is null
     */
    public function execute(?string $filePath, int $expirationMinutes = 60): ?string
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
            Log::error('Failed to generate temporary URL: '.$e->getMessage(), [
                'file_path' => $filePath,
                'exception' => $e,
            ]);

            return null;
        }
    }
}
