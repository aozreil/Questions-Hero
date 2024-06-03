export interface SearchQuestionResponse {
  "id": string,
  "text": string,
  "user_id": number,
  "relevant_score": number,
}

export interface SearchResponseInterface {
  "banners": {
    "source": string,
    "source_url": string,
  }[],
  "count": number,
  "data": SearchQuestionResponse[],
  "page": number
  "size": number
  "subjectsCounts": {
    "additionalProp1": number
    "additionalProp2": number
    "additionalProp3": number
  },
  "term": string,
  "uuid": string,
}

export interface OCRSearchResponseInterface extends SearchResponseInterface {
  aiImageAnalysis: {
    ocr_result?: string,
    answer?: string,
  },
}