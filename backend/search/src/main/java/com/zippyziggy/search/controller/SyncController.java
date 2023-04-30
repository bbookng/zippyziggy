package com.zippyziggy.search.controller;

import com.zippyziggy.search.dto.request.server.SyncEsPrompt;
import com.zippyziggy.search.service.EsPromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sync")
public class SyncController {

    private final EsPromptService esPromptService;

    /**
     * @param syncEsPrompt
     * @return
     */
    @PostMapping("/prompts")
    public ResponseEntity<Void> createDoc(
        @RequestBody SyncEsPrompt syncEsPrompt
    ) {
        esPromptService.insertDocument(syncEsPrompt);
        return ResponseEntity.ok().build();
    }

    /**
     * @param syncEsPrompt
     * @return
     */
    @PutMapping("/prompts")
    public ResponseEntity<Void> modifyDoc(
        @RequestBody SyncEsPrompt syncEsPrompt
    ) {
        esPromptService.updateDocument(syncEsPrompt);
        return ResponseEntity.ok().build();
    }

    /**
     * @param promptUuid
     * @return
     */
    @DeleteMapping("/prompts/{promptUuid}")
    public ResponseEntity<Void> deleteDoc(
        @PathVariable String promptUuid
    ) {
        esPromptService.deleteDocument(promptUuid);
        return ResponseEntity.ok().build();
    }

}
