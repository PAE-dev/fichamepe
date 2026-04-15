export function ratingLabelEs(rating: number): string {
  switch (rating) {
    case 5:
      return 'Excelente';
    case 4:
      return 'Muy bueno';
    case 3:
      return 'Bueno';
    case 2:
      return 'Regular';
    case 1:
      return 'Malo';
    default:
      return 'Valoración';
  }
}
