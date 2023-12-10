import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/module/movie';
import { MovieService } from 'src/app/service/movie.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Favorite } from 'src/app/module/favorite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userId: number = 0;
  movies: Movie[] | undefined;
  favorite!: Favorite[];
  constructor(private movieSrv: MovieService, private authSrv: AuthService) {}

  ngOnInit(): void {
    this.userId = this.movieSrv.getUserId();
    this.movieSrv.getMovie().subscribe((movie: Movie[]) => {
      this.movies = movie;
      this.getFavorite();
    });
  }

  isFavorite(movieId: number): boolean {
    return (
      Array.isArray(this.favorite) &&
      this.favorite.some((movie) => movie.movieId === movieId)
    );
  }

  addoRem(movieId: number) {
    if (this.isFavorite(movieId)) {
      let val: any = this.favorite.find((movie) => movie.movieId === movieId);
      if (val) {
        this.removeFavorite(val.id);
      }
    } else {
      this.addFavorite(movieId);
    }
  }

  removeFavorite(id: number) {
    this.movieSrv.removeFavorite(id).subscribe(() => {
      this.getFavorite();
    });
  }
  addFavorite(movieId: number) {
    this.movieSrv
      .addFavorite(movieId, this.userId)
      .subscribe((favorite: Favorite) => {
        this.getFavorite();
      });
  }

  getFavorite() {
    this.movieSrv.getFavorite().subscribe((favorite: Favorite[]) => {
      let userFavorite: Favorite[] = favorite.filter(
        (movie) => movie.userId === this.userId
      );
      this.favorite = userFavorite;
    });
  }
}
