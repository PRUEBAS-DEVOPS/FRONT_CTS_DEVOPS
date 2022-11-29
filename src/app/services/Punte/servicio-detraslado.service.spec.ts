import { TestBed } from '@angular/core/testing';

import { ServicioDetrasladoService } from './servicio-detraslado.service';

describe('ServicioDetrasladoService', () => {
  let service: ServicioDetrasladoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioDetrasladoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
