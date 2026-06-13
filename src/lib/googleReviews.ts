export type GoogleReview = {
  rating: string; // star string e.g. "★★★★★" for card display
  ratingValue: number; // raw 1-5 rating
  text: string;
  name: string;
  time: string; // relative description e.g. "a month ago"
};

type PlacesReview = {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string };
  relativePublishTimeDescription?: string;
};

type PlacesResponse = {
  reviews?: PlacesReview[];
};

const STAR = "★";

function toStars(rating: number): string {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return STAR.repeat(rounded) || STAR;
}

/**
 * Fetches up to 5 real reviews from the Google Places API (New).
 *
 * Requires GOOGLE_PLACES_API_KEY (key with Places API enabled + billing) and
 * GOOGLE_PLACE_ID. Returns an empty array when unconfigured or on any error so
 * callers can fall back to static placeholder testimonials.
 *
 * @param languageCode - "da" | "en", forwarded so Google localizes review text.
 */
export async function fetchGoogleReviews(
  languageCode: string
): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return [];
  }

  const url = new URL(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
  );
  url.searchParams.set("languageCode", languageCode === "da" ? "da" : "en");

  try {
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      // Cache reviews for an hour; they change infrequently and the API is billed.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as PlacesResponse;

    return (data.reviews ?? [])
      .map((review): GoogleReview | null => {
        const text = review.text?.text ?? review.originalText?.text ?? "";
        const name = review.authorAttribution?.displayName ?? "";
        const ratingValue =
          typeof review.rating === "number" ? review.rating : 0;

        if (!text || !name) {
          return null;
        }

        return {
          rating: toStars(ratingValue),
          ratingValue,
          text,
          name,
          time: review.relativePublishTimeDescription ?? "",
        };
      })
      .filter((review): review is GoogleReview => review !== null);
  } catch {
    return [];
  }
}
