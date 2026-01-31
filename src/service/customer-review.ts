import { prisma as db } from '../libs/prisma';
export interface CreateReviewInput {
  customerName: string;
  review: string;
  carModelId: string;
  carSubModelId: string;
}

const CreateReviewService = async ({
  data,
  image
}: {
  data: CreateReviewInput;
  image: string;
}) => {
  const { customerName, review, carModelId, carSubModelId } = data;
  const newReview = await db.customerReview.create({
    data: {
      customerName,
      review,
      image,
      carModelId,
      carSubModelId
    }
  });
  return newReview;
};

const GetReviewService = async () => {
  const reviews = await db.customerReview.findMany({
    include: {
      carModel: true,
      carSubModel: true
    }
  });

  const formattedReviews = reviews.map((review) => ({
    id: review.id,
    customerName: review.customerName,
    review: review.review,
    image: review.image,
    carModel: review.carModel?.name || null,
    carSubModel: review.carSubModel?.name || null
  }));

  return formattedReviews;
};

const GetReviewByIdService = async (id: string) => {
  const review = await db.customerReview.findUnique({
    where: { id: id },
    include: { carModel: true, carSubModel: true }
  });
  if (!review) {
    return null;
  }

  const formattedReview = {
    id: review.id,
    customerName: review.customerName,
    review: review.review,
    image: review.image,
    carModel: review.carModel?.name || null,
    carSubModel: review.carSubModel?.name || null
  };
  return formattedReview;
};

const DeleteReviewService = async (id: string) => {
  const review = await db.customerReview.delete({ where: { id: id } });
  return review;
};

export {
  CreateReviewService,
  GetReviewService,
  GetReviewByIdService,
  DeleteReviewService
};
