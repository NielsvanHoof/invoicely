<?php

namespace App\Actions\Files;

use Illuminate\Http\UploadedFile;

class HandleFileUpdateAction
{
    /**
     * Create a new action instance.
     */
    public function __construct(
        private DeleteFileAction $deleteFileAction,
        private StoreFileAction $storeFileAction
    ) {}

    /**
     * Handle file replacement.
     *
     * @param  string|null  $currentFilePath  The current file path
     * @param  UploadedFile|null  $newFile  The new file to upload
     * @param  bool  $removeFile  Whether to remove the file
     * @param  int  $userId  The user ID
     * @param  string  $directory  The directory to store the file in
     * @return string|null The new file path
     */
    public function execute(
        ?string $currentFilePath,
        ?UploadedFile $newFile,
        bool $removeFile,
        int $userId,
        string $directory
    ): ?string {
        // Handle file removal if requested
        if ($removeFile && $currentFilePath) {
            $this->deleteFileAction->execute($currentFilePath);

            return null;
        }

        // Handle new file upload
        if ($newFile) {
            // Delete old file if exists
            if ($currentFilePath) {
                $this->deleteFileAction->execute($currentFilePath);
            }

            return $this->storeFileAction->execute($newFile, $userId, $directory);
        }

        return $currentFilePath;
    }
}
