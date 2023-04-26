package com.zippyziggy.search.model;

public enum Sort {
    LIKE("like"), VIEW("view"), LATEST("latest");

    private final String sort;

    Sort(String sort) {
        this.sort = sort;
    }

    public String getSort() {
        return sort;
    }

}
