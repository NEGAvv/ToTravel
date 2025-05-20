import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-places',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-places.component.html',
  styleUrl: './search-places.component.scss'
})
export class SearchPlacesComponent implements OnInit {
  places: any[] = [];
  searchChanged: Subject<string> = new Subject<string>();
loading = false;

  filters = {
    search: '',
    sort_by: 'rating',
    sort_order: 'desc',
    categories: [] as string[],
    rating_filter: null as number | null, 
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.filters.search = params['search'];
      }
      this.fetchPlaces();
    });

    this.searchChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.updateUrlWithSearch(searchText);
    });
  }

  onSearchChange(search: string) {
    this.searchChanged.next(search);
  }

  updateUrlWithSearch(searchText: string) {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { search: searchText || null },
    queryParamsHandling: 'merge',
    replaceUrl: true
  });

  this.filters.search = searchText;
  this.fetchPlaces(); 
}


  fetchPlaces() {
    this.loading = true;
    let params = new HttpParams();

    if (this.filters.search) {
        params = params.set('search', this.filters.search);
    }

    params = params.set('sort_by', this.filters.sort_by)
        .set('sort_order', this.filters.sort_order);

    // Add rating filter if specified
    if (this.filters.rating_filter !== null) {
        params = params.set('rating', this.filters.rating_filter);
    }

    // Add categories if any
    if (this.filters.categories.length) {
        this.filters.categories.forEach((cat) => {
            params = params.append('categories[]', cat);
        });
    }

    this.http.get<any[]>('http://127.0.0.1:8000/api/places', { params }).subscribe({
      next: (res) => {
        this.places = res;
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching places:', err);
      },
      complete: () => {
        this.loading = false; 
      }
    });
}

  toggleCategory(event: any) {
    const category = event.target.value;
    if (event.target.checked) {
      this.filters.categories.push(category);
    } else {
      this.filters.categories = this.filters.categories.filter((c) => c !== category);
    }
    this.fetchPlaces();
  }

  setRatingFilter(rating: number | null) {
    this.filters.rating_filter = rating;
    this.fetchPlaces();
  }

  goToDetails(id: number) {
  this.router.navigate(['/places', id]);
}
 getRatingStars(rating: any): number[] {
    const numericRating = parseFloat(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starValue = numericRating - i;
      stars.push(starValue >= 1 ? 1 : starValue > 0 ? starValue : 0);
    }
    return stars;
  }
}