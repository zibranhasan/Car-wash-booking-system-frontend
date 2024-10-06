import BlogSection from "../components/ui/BlogSection";
import HeroSection from "../components/ui/HeroSection";

import ReviewSection from "../components/ui/ReviewSection";
import SpecialOffers from "../components/ui/SpecialOffers";

import {
  useCreateReviewMutation,
  useGetAllReviewQuery,
} from "../redux/api/reviewApi";
import { useAppSelector } from "../redux/hook";
import FeaturedServices from "./FeaturedServices";

import AboutUs from "../components/ui/AboutUs";

const HomePage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { data: allReview } = useGetAllReviewQuery(undefined);
  const [createReview] = useCreateReviewMutation();

  const allReviewData = allReview?.response.data || [];

  const overallRating =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allReviewData.reduce((acc: any, review: any) => acc + review.rating, 0) /
    allReviewData.length;

  return (
    <div style={{ margin: "0px" }}>
      <HeroSection />

      <SpecialOffers />
      <FeaturedServices />
      <ReviewSection
        reviews={allReviewData}
        overallRating={overallRating}
        isLoggedIn={!!token}
        onSubmitReview={createReview}
      />
      <BlogSection />

      <AboutUs />
    </div>
  );
};

export default HomePage;
