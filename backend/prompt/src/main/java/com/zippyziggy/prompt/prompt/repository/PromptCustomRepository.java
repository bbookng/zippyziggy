package com.zippyziggy.prompt.prompt.repository;

import com.zippyziggy.prompt.prompt.dto.response.RatingDto;
import com.zippyziggy.prompt.prompt.model.Category;
import com.zippyziggy.prompt.prompt.model.Prompt;

import java.util.List;
import java.util.UUID;

public interface PromptCustomRepository {

    public List<RatingDto> findAllByCategory(Category category);
}
